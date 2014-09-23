var fs=require('fs');

var template=fs.readFileSync(process.argv[2],'utf-8');
var conf=fs.readFileSync(process.argv[3],'utf-8');

lineList=conf.split('\n');

lineCount=lineList.length;

var out='';
var pos=0;

for(lineNum=0;lineNum<lineCount;lineNum++) {
	line=lineList[lineNum];

	fieldList=line.split('\t');
	if(fieldList.length<5) continue;

	out+=template.substr(pos,+fieldList[2]-pos);
	out+=fieldList[4];
	pos=+fieldList[2]+1;
	if(template.charAt(pos-1)!='$') console.error('Template is corrupt! No field at character offset '+pos);
}

out+=template.substr(pos);
console.log(out);
