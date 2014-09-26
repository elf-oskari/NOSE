var fs=require('fs');

var placeHolder='$';

var template=fs.readFileSync(process.argv[2],'utf-8');
var conf=fs.readFileSync(process.argv[3],'utf-8');

lineList=conf.split('\n');

lineCount=lineList.length;

var out='';
var pos=0;

for(lineNum=0;lineNum<lineCount;lineNum++) {
	line=lineList[lineNum];

	fieldList=line.split('\t');
	if(fieldList.length<6) continue;

	newPos=+fieldList[3];

	out+=template.substr(pos,newPos-pos);
	out+=fieldList[5];
	pos=newPos+placeHolder.length;
	if(template.substr(pos-1,placeHolder.length)!=placeHolder) console.error('Template is corrupt! No field at character offset '+pos);
}

out+=template.substr(pos);
console.log(out);
