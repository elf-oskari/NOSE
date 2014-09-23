'use strict';

var fs = require('fs');
var sax = require('sax');

function bindToScope(scope, fn) {
	return function() {
		fn.apply(scope, arguments);
	};
};

/** @constructor */
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

/** @constructor */
var CommentNode = function(txt) {
	this.txt = txt;
};

CommentNode.prototype.encode = function(xmlEncoder, outputCharPos) {
	return xmlEncoder.encodeComment(this.txt);
};

/** @constructor */
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

/** @constructor */
var TagNode = function(node) {
	this.node = node;
	this.childList = [];
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

	for(partNum=0;partNum<partCount;) {
		part=partList[partNum++];
		attrTbl=partList[partNum];

		if(typeof(attrTbl)=='object') partNum++;
		else attrTbl=null;

		childList=tag.childList;
		childCount=childList.length;

		for(childNum=0;childNum<childCount;childNum++) {
			child=childList[childNum];
			if(child instanceof TagNode && child.matchRule(part,attrTbl)) {
				tag=child;
				break;
			}
		}

		if(childNum==childCount) return(null);
	}

	return(tag);
};

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

/** @constructor */
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

Rule.prototype.formatNames=function() {
	return(this.nameList.join(';'));
};

Rule.prototype.formatComment=function() {
	return(this.comment || '');
};

Rule.prototype.encode = function(xmlEncoder, outputCharPos) {
	return(this.id+'\t'+outputCharPos+'\t'+this.formatNames()+'\t'+this.formatComment());
};

/** @constructor */
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

// Encode special characters as XML entities.
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

/** @constructor */
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

/** @constructor */
var SldParser = function(outStream) {
	this.captureStack = [];
	this.capturing = false;
	this.outputCharPos = 0;

	this.xmlStream = null;
	this.initStream();

	this.xmlEncoder = new XmlEncoder();
	this.outStream=outStream;

	this.latestComment=null;
};

SldParser.prototype.parse = function(inStream) {
	inStream.pipe(this.xmlStream);
};

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

SldParser.prototype.handleClosingTag = function(tagName) {
	if (this.capturing) {
		this.captureClosingTag();
	} else {
		this.writeOut(this.xmlEncoder.encodeClosingTag(tagName));
	}

	this.latestComment=null;
};

SldParser.prototype.handleTextNode = function(txt) {
	if (this.capturing) {
		this.captureText(txt);
	} else {
		this.writeOut(this.xmlEncoder.encodeText(txt));
	}
};

SldParser.prototype.handleCommentNode = function(txt) {
	if (this.capturing) {
		this.captureComment(txt);
	} else {
		this.writeOut(this.xmlEncoder.encodeComment(txt));
		this.latestComment=txt;
	}
};

SldParser.prototype.handleEnd = function() {
	this.onEnd();
};

SldParser.prototype.onProcessNode = function(node) {};
SldParser.prototype.onEnd = function() {};

function parse() {
	var ruleId=0;
	var fieldId=0;

	var inFileName = process.argv[2];
	var outFileName = process.argv[3];

	var inStream = fs.createReadStream(inFileName);
	var outStream = fs.createWriteStream(outFileName);

	var parser = new SldParser(outStream);

	parser.onProcessNode = function(node) {
		var rule;
		var spec;
		var field;
		var marker;
		var nameNode;

		var namePathList=[
			['Name'],['Title']
		];

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

		function serializeSpec(spec) {
			return(spec.path.map(function(part) {
				var argList;

				if(typeof(part)=='object') {
					argList=[];

					for(var key in part) {
						argList.push(key+'\t'+part[key]);
					}

					argList.sort();

					if(argList.length) return('('+argList.map(function(arg) {
						return(arg.split('\t')[1]);
					}).join(',')+')');
				} else {
					return('/'+part);
				}
			}).join('').substr(1));
		}

		rule=new Rule(ruleId++);

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
			field.setText('');
		}
	};

	parser.onEnd=function() {
		console.log('');
	};

	parser.parse(inStream);
}

parse();
