var fs=require('fs');
var pg=require('pg.js');
var Promise = require('es6-promise').Promise;

/** Return reference to function fn that when called, makes fn see scope
  * as "this" variable. */
function bindToScope(scope, fn) {
	return function() {
		fn.apply(scope, arguments);
	};
};

var PgDatabase=function() {
	this.client=null;
};

PgDatabase.prototype.connect=function(conf) {
	var self=this;

	return(new Promise(function(resolve,reject) {
		self.client=new pg.Client(conf);
		self.client.connect(function(err) {
			if(err) {
				return(reject('Unable to connect to database: '+err));
			}

			resolve();
		});
	}));
}

PgDatabase.prototype.close=function(conf) {
	var self=this;

	return(new Promise(function(resolve,reject) {
		resolve(self.client.end());
	}));
}

PgDatabase.prototype.exec=function() {
	var query=this.client.query.apply(this.client,arguments);

	return(new Promise(function(resolve,reject) {
		query.on('error',function(err) {
			reject(err);
		});

		query.on('end',function(state) {
			resolve(state);
		});
	}));
}

PgDatabase.prototype.querySingle=function() {
	var query=this.client.query.apply(this.client,arguments);

	return(new Promise(function(resolve,reject) {
		var result;

		query.on('row',function(row) {
			result=row;
		});

		query.on('error',function(err) {
			reject(err);
		});

		query.on('end',function(state) {
			resolve(result);
		});
	}));
}

PgDatabase.prototype.begin=function() {
	return(this.exec('BEGIN TRANSACTION'));
}

PgDatabase.prototype.commit=function() {
	return(this.exec('COMMIT'));
}

PgDatabase.prototype.rollback=function() {
	return(this.exec('ROLLBACK'));
}

var SldInserter=function() {
	this.db=null;
	this.dbConf=null;
}

SldInserter.prototype.connect=function(dbPath) {
	var self=this;

	this.db=new PgDatabase();

	return(new Promise(function(resolve,reject) {
		try {
			var dbJson=fs.readFileSync(dbPath,'utf-8');
			self.dbConf=JSON.parse(dbJson);
			resolve();
		} catch(e) {
			return(reject('Unable to read database configuration: '+e));
		}
	}).then(self.db.connect(this.dbConf)).then(this.db.begin()));
};

SldInserter.prototype.abort=function() {
	return(this.db.rollback().then(this.db.close()));
};

SldInserter.prototype.finish=function() {
	var self=this;

	console.log('COMMIT');

	return(this.db.commit().then(function() {
		return(self.db.close());
	}));
};

SldInserter.prototype.readFile=function(path,name) {
	return(new Promise(function(resolve,reject) {
		fs.readFile(path,{encoding:'utf-8'},function(err,data) {
			if(err) return(reject('Unable to read '+name+': '+err));
			resolve(data);
		})
	}));
};

SldInserter.prototype.insertTemplate=function(templatePath) {
	var self=this;

	return(this.readFile(templatePath,'SLD template').then(function(sldTemplate) {
		return(self.db.querySingle('INSERT INTO sld_template (content,name) VALUES ($1,$2) RETURNING id',[sldTemplate,'foobar']));
	}));
};

SldInserter.prototype.insertConfig=function(configPath,templateId) {
	var promiseList=[];
	var readyCount=0;

	var self=this;

	return(this.readFile(configPath,'SLD config').then(function(sldConfig) {
		return(new Promise(function(resolve,reject) {
			var lineList;
			var lineNum,lineCount;
			var fieldList;
			var featureTypeInserted,ruleInserted,fieldInserted;

			lineList=sldConfig.split(/\r?\n/);
			lineCount=sldConfig.length;

			for(lineNum=0;lineNum<lineCount;lineNum++) {
				line=lineList[lineNum];
				if(!line) continue;
				fieldList=line.split('\t');

				type=fieldList[0];

				if(type=='FeatureType') {
					featureTypeInserted=self.db.querySingle('INSERT INTO sld_featuretype (template_id,name,title,featuretype_name) VALUES ($1,$2,$3,$4) RETURNING id',[templateId.id,'','','']);
					featureTypeInserted.catch(function(err) {
						reject('Error inserting feature type: '+err);
					});
					promiseList.push(featureTypeInserted);
				}

				if(type=='Rule') {
					ruleInserted=(function(fieldList) {
						return(featureTypeInserted.then(function(featureTypeId) {
							var nameList=fieldList[3].split(';');
							return(self.db.querySingle('INSERT INTO sld_rule (featuretype_id,name,title,abstract) VALUES ($1,$2,$3,$4) RETURNING id',[featureTypeId.id,nameList[0],nameList[1],nameList[2]]));
						}));
					})(fieldList);
					ruleInserted.catch(function(err) {
						reject('Error inserting rule: '+err);
					});
					promiseList.push(ruleInserted);
				}

				if(type=='Field') {
					fieldInserted=(function(fieldList) {
						return(ruleInserted.then(function(ruleId) {
							return(self.db.querySingle('INSERT INTO sld_param (rule_id,template_offset,type_id,default_value) VALUES ($1,$2,$3,$4) RETURNING id',[ruleId.id,fieldList[3],1,fieldList[5]]));
						}));
					})(fieldList);
					fieldInserted.catch(function(err) {
						reject('Error inserting field: '+err);
					});
					promiseList.push(fieldInserted);
				}
			}

			Promise.all(promiseList).then(function() {
				resolve();
			});
		}));
	}));
};

function run() {
	var inserter=new SldInserter();

	var connected=inserter.connect('db.json');

	var templateInserted=connected.then(function() {
		return(inserter.insertTemplate(process.argv[2]));
	});

	var configInserted=templateInserted.then(function(templateId) {
		return(inserter.insertConfig(process.argv[3],templateId));
	});

	var ready=configInserted;

	ready.catch(function(err) {
		inserter.abort();
		console.error(err);
		return;
	});


	ready.then(function() {
		return(inserter.finish());
	}).then(function() {
		console.log('Success!');
	});
}

run();
