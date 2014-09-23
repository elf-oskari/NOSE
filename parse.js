/* This tool parses an SLD file and replaces certain recognized fields (like
 * colors and linestyles) with placeholders. It groups them by rules and also
 * produces a field description file that references each placeholder.
 * The descriptions store the original removed value and the parent tags of
 * the field.
 * Sax parses XML and calls handler functions which usually output it as is
 * which makes most data stream through the parser.
 * SLD rules and any tags inside them are first read into a Javascript object.
 * When the rule's closing tag is found, the object is processed and encoded
 * back to XML. */

'use strict';

var fs = require('fs');
var sax = require('sax');

/** Return reference to function fn that when called, makes fn see scope
  * as "this" variable. */
function bindToScope(scope, fn) {
	return function() {
		fn.apply(scope, arguments);
	};
};

/** @constructor
  * Marker that when exported as XML, outputs a field definition in JSON format
  * to another file including the marker's character offset in XML output. */
var FieldMarkerNode = function(id,typeName,defaultValue,rule) {
	this.id = id;
	this.typeName=typeName;
	this.defaultValue=defaultValue;
	this.rule=rule;
};

FieldMarkerNode.prototype.encode = function(xmlEncoder, outputCharPos) {
	console.log('\t'+this.id+'\t'+outputCharPos+'\t'+this.typeName+'\t'+this.defaultValue);

	return('');
};

/** @constructor
  * Represents an XML comment. */
var CommentNode = function(txt) {
	this.txt = txt;
};

CommentNode.prototype.encode = function(xmlEncoder, outputCharPos) {
	return xmlEncoder.encodeComment(this.txt);
};

/** @constructor
  * Represents text or whitespace in an XML document. */
var TextNode = function(txt) {
	this.txt = txt;
};

TextNode.prototype.getText = function() {
	return this.txt;
};

TextNode.prototype.setText = function(txt) {
	this.txt = txt;
};

TextNode.prototype.encode = function(xmlEncoder, outputCharPos) {
	return xmlEncoder.encodeText(this.txt);
};

/** @constructor
  * Represents an XML tag captured in memory for processing. */
var TagNode = function(node) {
	/** Sax node object. */
	this.node = node;
	/** @type {Array.<Object>} Child tags, text/comment nodes or markers. */
	this.childList = [];
	/** @type {string} Human-readable description. */
	this.comment=null;
};

TagNode.prototype.appendChild = function(obj) {
	this.childList.push(obj);
	obj.parent = this;
};

TagNode.prototype.insertBefore = function(child, obj) {
	var pos;

	pos=this.childList.indexOf(child);
	if(pos>=0) this.childList.splice(pos,0,obj);
};

/** Check if tag's attributes matches attrTbl which is an object with
  * required attributes as keys associated to their required values. */
TagNode.prototype.matchRule = function(tagName,attrTbl) {
	var attr;

	if(this.node.name!=tagName) return(false);

	if(attrTbl) {
		for(attr in attrTbl) {
			if(this.node.attributes[attr]!=attrTbl[attr]) return(false);
		}
	}

	return(true);
};

/** Search for a child node inside a tag. partList is a list of tag name strings.
  * Required attributes of a tag can be included in the list as an object after
  * the tag's name, like: ['Parent',{'attr:1'},'Child'] to find Child in XML like:
  * <Tag><Parent attr="1"><Child>...</Child></Parent></Tag>
  * Always greedily moves inside a tag matching the current pathList item and
  * moves to the next item, does not backtrack. */
TagNode.prototype.query = function(partList) {
	var partNum,partCount;
	var part;
	var tag;
	var childList;
	var childNum,childCount;
	var child;
	var attrTbl;

	partCount=partList.length;

	tag=this;

	// Loop through list of nested tag names where result is supposed to be found.
	for(partNum=0;partNum<partCount;) {
		part=partList[partNum++];
		attrTbl=partList[partNum];

		// If tag name is followed by an object, assume it contains required
		// attributes and their values for that tag.
		if(typeof(attrTbl)=='object') partNum++;
		else attrTbl=null;

		childList=tag.childList;
		childCount=childList.length;

		// Loop through child nodes.
		for(childNum=0;childNum<childCount;childNum++) {
			child=childList[childNum];
			// If child is a tag with name matching next item from partList,
			// check if any required attributes were given and the tag has them.
			if(child instanceof TagNode && child.matchRule(part,attrTbl)) {
				// This tag is the result or one of its ancestors.
				tag=child;
				break;
			}
		}

		if(childNum==childCount) return(null);
	}

	return(tag);
};

/** Works like the query method but as a last step finds a child text node. */
TagNode.prototype.queryText = function(partList) {
	var tag;
	var childList;
	var childNum,childCount;
	var child;

	tag=this.query(partList);
	if(!tag) return(null);

	childList=tag.childList;
	childCount=childList.length;

	for(childNum=0;childNum<childCount;childNum++) {
		child=childList[childNum];
		if(child instanceof TextNode) return child;
	}

	return(null);
};

TagNode.prototype.setComment=function(txt) {
	this.comment=txt;
};

/** @constructor
  * Represents an SLD rule captured in memory. */
var Rule = function(id) {
	this.id=id;
	this.nameList=[];
	this.comment=null;
};

Rule.prototype.addName=function(name) {
	this.nameList.push(name);
};

Rule.prototype.setComment=function(txt) {
	this.comment=txt;
};

Rule.prototype.formatNamesForJson=function() {
	return(this.nameList.join(';'));
};

Rule.prototype.formatCommentForJson=function() {
	return(this.comment || '');
};

/** Produce rule description for JSON output. */
Rule.prototype.encode = function(xmlEncoder, outputCharPos) {
	return(
		this.id+'\t'+
		outputCharPos+'\t'+
		this.formatNamesForJson()+'\t'+
		this.formatCommentForJson()
	);
};

/** @constructor
  * Encoder for XML entities like &gt; while decoding is handled by sax. */
var EntityEncoder = function() {
	this.entityCodeTbl = {};
	this.initEntityCodeTbl();
};

EntityEncoder.prototype.initEntityCodeTbl = function() {
	// Create table for converting characters to sax entities.
	for (var code in sax.ENTITIES) {
		this.entityCodeTbl[sax.ENTITIES[code]] = code;
	}
};

/** Encode special characters as XML entities. */
EntityEncoder.prototype.encode = function(txt) {
	var pos, len;
	var chr, entityCode, out;
	var unchangedCharsStart;

	function outputNewUnchangedChars() {
		out += txt.substr(unchangedCharsStart, pos - unchangedCharsStart);
		unchangedCharsStart = pos + 1;
	}

	len = txt.length;
	unchangedCharsStart = 0;
	out = '';

	for (pos = 0; pos < len; pos++) {
		chr = txt.charAt(pos);
		entityCode = this.entityCodeTbl[chr];

		if (entityCode) {
			outputNewUnchangedChars();
			out += '&' + entityCode + ';';
		}
	}

	outputNewUnchangedChars();

	return out;
};

/** @constructor
  * Encodes Javascript objects to XML. Object tree must consist of instances of
  * the FieldMarkerNode, CommentNode, TextNode and TagNode classes. */
var XmlEncoder = function() {
	this.entityEncoder = new EntityEncoder();
}

XmlEncoder.prototype.encodeOpeningTag = function(node) {
	var attr,value;
	var txt;

	txt = '<' + node.name;

	for (attr in node.attributes) {
		if (!node.attributes.hasOwnProperty(attr)) continue;

		value = this.entityEncoder.encode(node.attributes[attr]);
		txt += ' ' + attr + '="' + value + '"';
	}

	if (node.isSelfClosing) txt += '/>';
	else txt += '>';

	return txt;
};

XmlEncoder.prototype.encodeClosingTag = function(tagName) {
	return '</' + tagName + '>';
};

XmlEncoder.prototype.encodeCapturedNode = function(obj, outputCharPos) {
	var node;
	var childList;

	if (obj instanceof TagNode) {
		node = obj.node;
		childList = obj.childList;

		return this.encodeCapturedTag(node, childList, outputCharPos);
	} else {
		return obj.encode(this, outputCharPos);
	}
};

XmlEncoder.prototype.encodeCapturedTag = function(node, childList, outputCharPos) {
	var childNum, childCount;
	var txt;

	childCount = childList.length;

	txt = this.encodeOpeningTag(node);

	for (childNum = 0; childNum < childCount; childNum++) {
		txt += this.encodeCapturedNode(childList[childNum], outputCharPos + txt.length);
	}

	txt += this.encodeClosingTag(node.name);

	return txt;
};

XmlEncoder.prototype.encodeComment = function(txt) {
	return '<!--' + txt + '-->';
};

XmlEncoder.prototype.encodeText = function(txt) {
	return this.entityEncoder.encode(txt);
};

/** @constructor
  * Main class of the parser, pipes input data to sax and sets up handlers to
  * process XML tags. */
var SldParser = function(outStream) {
	/** @type {Array.<Object>} Stack for reading nested tag structures into
	  * JavaScript objects. First tag is always an SLD rule and each item is
	  * nested deeper than the previous. */
	this.captureStack = [];
	/** @type {boolean} Flag set if sax is currently inside an SLD rule so its
	  * output needs to be read into an object. If flag is cleared, XML
	  * from input is sent straight into output as unmodified as possible. */
	this.capturing = false;
	/** @type {number} Number of characters written into XML output. */
	this.outputCharPos = 0;

	this.xmlStream = null;
	this.initStream();

	this.xmlEncoder = new XmlEncoder();
	this.outStream=outStream;

	this.latestComment=null;
};

/** Parser main loop is inside Node.js stream pipe operation and/or sax
  * which are called here. */
SldParser.prototype.parse = function(inStream) {
	inStream.pipe(this.xmlStream);
};

/** Initialize sax and set up handlers called when sax finds tags, text,
  * comments etc. */
SldParser.prototype.initStream = function() {
	var strict = true;
	var xmlStream = sax.createStream(strict);

	xmlStream.on('processinginstruction',
		bindToScope(this, this.handleXmlHeader));
	xmlStream.on('opentag', bindToScope(this, this.handleOpeningTag));
	xmlStream.on('closetag', bindToScope(this, this.handleClosingTag));
	xmlStream.on('text', bindToScope(this, this.handleTextNode));
	xmlStream.on('comment', bindToScope(this, this.handleCommentNode));
	xmlStream.on('end', bindToScope(this, this.handleEnd));

	this.xmlStream = xmlStream;
};

/** All writes to XML output file go through this method, which also tracks
  * number of characters written so that when a marker is encountered, its
  * character position in output is known. */
SldParser.prototype.writeOut = function(txt) {
	this.outStream.write(txt);
	this.outputCharPos += txt.length;
};

SldParser.prototype.getCurrentTag = function() {
	return this.captureStack[this.captureStack.length - 1];
};

SldParser.prototype.captureOpeningTag = function(node) {
	var tag, parent;

	tag = new TagNode(node);

	parent = this.getCurrentTag();
	if (parent) parent.appendChild(tag);

	if(this.latestComment) tag.setComment(this.latestComment);

	this.captureStack.push(tag);

	return tag;
};

SldParser.prototype.captureClosingTag = function() {
	var obj;
	var txt;

	obj = this.captureStack.pop();
	if (this.captureStack.length == 0) this.capturing = false;

	if (obj.needsProcessing) {
		this.onProcessNode(obj);
		txt = this.xmlEncoder.encodeCapturedNode(obj, this.outputCharPos);

		if (this.capturing) captureText(txt);
		else this.writeOut(txt);
	}
};

/** Store text from input XML into memory for processing.  */
SldParser.prototype.captureText = function(txt) {
	this.getCurrentTag().appendChild(new TextNode(txt));
};

SldParser.prototype.captureComment = function(txt) {
	this.getCurrentTag().appendChild(new CommentNode(txt));
};

SldParser.prototype.handleXmlHeader = function(node) {
	this.writeOut('<?' + node.name + ' ' + node.body + '?>');
};

SldParser.prototype.needsCapturing = function(node) {
	if (node.name == 'Rule') {
		return true;
	}

	return false;
};

/** Called when sax has read an opening tag. Recognizes if it's an SLD rule
  * and flags everything inside it to be temporarily stored into an object. */
SldParser.prototype.handleOpeningTag = function(node) {
	var obj;
	var needsProcessing = false;

	if (this.needsCapturing(node)) {
		this.capturing = true;
		needsProcessing = true;
	}

	if (this.capturing) {
		obj = this.captureOpeningTag(node);
		if (needsProcessing) obj.needsProcessing = true;

		if (node.isSelfClosing) this.captureClosingTag();
	} else {
		this.writeOut(this.xmlEncoder.encodeOpeningTag(node));
	}

	this.latestComment=null;
};

/** Called when sax has read a closing tag. Passed on as is or if the tag was
  * captured into an object, processes it and encodes back to XML. */
SldParser.prototype.handleClosingTag = function(tagName) {
	if (this.capturing) {
		this.captureClosingTag();
	} else {
		this.writeOut(this.xmlEncoder.encodeClosingTag(tagName));
	}

	this.latestComment=null;
};

/** Called when sax has read text or whitespace. */
SldParser.prototype.handleTextNode = function(txt) {
	if (this.capturing) {
		this.captureText(txt);
	} else {
		this.writeOut(this.xmlEncoder.encodeText(txt));
	}
};

/** Called when sax has read a comment. */
SldParser.prototype.handleCommentNode = function(txt) {
	if (this.capturing) {
		this.captureComment(txt);
	} else {
		this.writeOut(this.xmlEncoder.encodeComment(txt));
		this.latestComment=txt;
	}
};

/** Called when sax has finished and parsing is about to terminate. */
SldParser.prototype.handleEnd = function() {
	this.onEnd();
};

/** Called when a tag captured into a Javascript object has been read completely
  * and is about to be encoded back into XML. Override this method to process
  * the decoded XML data. */
SldParser.prototype.onProcessNode = function(node) {};
/** Override to do something after parsing is done. */
SldParser.prototype.onEnd = function() {};

/** Main function, reads input and writes output. */
function parse() {
	var ruleId=0;
	var fieldId=0;

	var inFileName = process.argv[2];
	var outFileName = process.argv[3];

	var inStream = fs.createReadStream(inFileName);
	var outStream = fs.createWriteStream(outFileName);

	var parser = new SldParser(outStream);

	/** Handle all processing of SLD rules. */
	parser.onProcessNode = function(node) {
		var rule;
		var spec;
		var field;
		var marker;
		var nameNode;

		var namePathList=[
			['Name'],['Title']
		];

		/** List of fields (editable SLD parameters) and how to find them.
		  * Describes each field's parent tags up to its parent rule.
		  * A tag's required attributes are listed in an object after its name. */
		var fieldSpecList=[
			{
				path:['PolygonSymbolizer','Fill','GraphicFill','Graphic','Mark','WellKnownName']
			},{
				path:['PolygonSymbolizer','Fill','GraphicFill','Graphic','Size']
			},{
				path:['LineSymbolizer','Stroke','CssParameter',{'name':'stroke'}]
			},{
				path:['LineSymbolizer','Stroke','CssParameter',{'name':'stroke-width'}]
			},{
				path:['PolygonSymbolizer','Fill','GraphicFill','Graphic','Mark','Stroke','CssParameter',{'name':'stroke'}]
			},{
				path:['PolygonSymbolizer','Fill','GraphicFill','Graphic','Mark','Stroke','CssParameter',{'name':'stroke-width'}]
			}
		];

		/** Convert the list of a field's parent tags and their attributes into
		  * a string. */
		function serializeSpec(spec) {
			return(spec.path.map(function(part) {
				var argList;

				if(typeof(part)=='object') {
					argList=[];

					// Loop through required attributes and list key-value pairs.
					for(var key in part) {
						argList.push(key+'\t'+part[key]);
					}

					// Sort the attributes alphabetically by key.
					argList.sort();

					// Remove keys and make a comma-separated list of required
					// values.
					if(argList.length) return('('+argList.map(function(arg) {
						return(arg.split('\t')[1]);
					}).join(',')+')');
				} else {
					return('/'+part);
				}
			}).join('').substr(1));
		}

		rule=new Rule(ruleId++);

		// Store any comment immediately before a rule.
		// It might be a human-readable description of the rule.
		if(node.comment) rule.setComment(node.comment);

		for(var i=0;i<namePathList.length;i++) {
			nameNode=node.queryText(namePathList[i]);
			if(nameNode) {
				rule.addName(nameNode.getText());
			}
		}

		console.log('\n'+rule.encode(this.xmlEncoder,this.outputCharPos));

		for(var i=0;i<fieldSpecList.length;i++) {
			spec=fieldSpecList[i];
			field=node.queryText(spec.path);
			if(!field) continue;

			marker=new FieldMarkerNode(fieldId++,serializeSpec(spec),field.getText(),rule);
			field.parent.insertBefore(field,marker);
			field.setText('$');
		}
	};

	parser.onEnd=function() {
		console.log('');
	};

	parser.parse(inStream);
}

// This is where the program actually begins.
parse();
