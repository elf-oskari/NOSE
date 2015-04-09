/** @fileoverview
  * This tool reads the output of parse.js and writes it into a PostgreSQL
  * database. Use like this:
  *
  * node store.js template.sld fields.csv
  *
  * Data gets written into the following tables:
  *
  * - sld_template      Template XML from parse.js, with modifiable parameters
  *                     replaced by placeholders.
  * - sld_featuretype   FeatureTypeStyle tags.
  * - sld_rule          Rules inside FeatureTypeStyles, and their names.
  * - sld_param         Modifiable parameters inside rules, and their
  *                     default values.
  * - sld_type          Location of each parameter type in the SLD structure.
  *                     Essentially fieldSpecList from parse.js is stored here
  *                     in serialized form. */

var fs=require('fs');
var pg=require('pg.js');
var Promise = require('es6-promise').Promise;
var filename = '';
var tname = '';
var template_id = 0;

/** @constructor
  * Deferred encapsulates a promise that gets fulfilled by outside code. */
var Deferred=function() {
	var self=this;

	this.promise=new Promise(function(resolve,reject) {
		self.resolve=resolve;
		self.reject=reject;
	});
};

/** Return a new function that calls fn making it see the desired scope
  * through its "this" variable.
  * @param {Object} scope Variable fn should see as "this".
  * @param {function()} fn Function to call. */
function bindToScope(scope, fn) {
	return function() {
		fn.apply(scope, arguments);
	};
};

/** @constructor
  * PostgreSQL database interface.
  * Simple wrapper to use promises with pg.js. */
var PgDatabase=function() {
	this.client=null;
};

/** @param {Object} client:
  * host, port, database, user and password. */
PgDatabase.prototype.connect=function(client) {
	var defer=new Deferred();

	this.client=client;
/*	this.client.connect(function(err) {
		if(err) return(defer.reject('Unable to connect to database: '+err));
		defer.resolve();
	}); */
    defer.resolve();
	return(defer.promise);
}


/** Execute query without reading any results. */
PgDatabase.prototype.exec=function() {
	var query=this.client.query.apply(this.client,arguments);
	var defer=new Deferred();

	query.on('error',function(err) {
		defer.reject(err);
	});

	query.on('end',function(state) {
		defer.resolve(state);
	});

	return(defer.promise);
}

/** Send query to database and read a single result row. */
PgDatabase.prototype.querySingle=function() {
	var query=this.client.query.apply(this.client,arguments);
	var defer=new Deferred();
	var result;

	query.on('row',function(row) {
		result=row;
	});

	query.on('error',function(err) {
		defer.reject(err);
	});

	query.on('end',function(state) {
		if(!result) return(defer.reject('Not found'));
		defer.resolve(result);
	});

	return(defer.promise);
}


PgDatabase.prototype.queryResult=function() {
	var query=this.client.query.apply(this.client,arguments);
	var defer=new Deferred();
	var result = [];

	query.on('row',function(row) {
		result.push(row);
	});

	query.on('error',function(err) {
		defer.reject(err);
	});

	query.on('end',function(state) {
		if(!result) return(defer.reject('Not found'));
		defer.resolve(result);
	});

	return(defer.promise);
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

/** @constructor
  * SldInserter stores a parsed SLD template and field configuration
  * into an SQL database. */
var SldInserter=function() {
	this.db=null;

}

/** @param {object} pg client */
SldInserter.prototype.connect=function(client) {
	var defer=new Deferred();

	this.db=new PgDatabase();

	return(this.db.connect(client)).then(this.db.begin());
};

/** Roll back current transaction and close connection. */
SldInserter.prototype.abort=function() {
	return(this.db.rollback()); //.then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldInserter.prototype.finish=function() {
	return(this.db.commit()); //.then(bindToScope(this.db,this.db.close)));
};


/** @param {number} templateId Refers to a template in the database.
  * @return {Promise} */
SldInserter.prototype.insertSldValue=function(configId,paramId,value) {
    console.log("inserting: ", configId,paramId,value);
	return(this.db.querySingle(
		'INSERT INTO sld_value (config_id,param_id,value)'+
			' VALUES ($1,$2,$3)'+
			' RETURNING id',[configId,paramId,value]
	));
};



/** Insert rule and parameter descriptions from parse.js into the database.
  * @param {string} sldConfig Entire config file text content to parse.
  * @param {number} templateId Refers to a template in the database.
  * @return {Promise} Resolved when everything has been successfully inserted. */
SldInserter.prototype.parseConfig=function(sldConfig, config_id) {
	console.log("looping param valules and saving data");

	var defer=new Deferred();
	/** A separate promise for each database INSERT command to track them. */
	var promiseList=[];
	console.log("configin name: ", sldConfig.name);

	var lineList;
	var lineNum,lineCount;
	var fieldList;
	var featureTypeInserted,ruleInserted,fieldInserted,symbolizerInserted;

	lineList=sldConfig.sld_values;  //.split(/\r?\n/);
	lineCount=lineList.length;

	console.log("lines", lineCount);

	for(lineNum=0;lineNum<lineCount;lineNum++) {

		console.log("rivi: ", lineNum);
		line=lineList[lineNum];

		console.log("param: " ,line.param_id, "value: " ,line.value, "config_id: ", config_id);
		//console.log("value: " ,line.value);
		//console.log("config_id: ", config_id);

		featureTypeInserted=this.insertSldValue(config_id, line.param_id, line.value);
		featureTypeInserted.catch(function(err) {
			defer.reject('Error inserting feature type: '+err);
		});
		promiseList.push(featureTypeInserted); 
		
	}

	// Ready when all inserts finish.
	Promise.all(promiseList).then(function() {
		defer.resolve();
	});

	return(defer.promise);
};

/** Read SLD parameters and store them associated with templateId in the database.
  * @param {string []} params  parameter descriptions.
  * @param {number} templateId Refers to a template in the database.
  * @return {Promise} Resolved when everything has been successfully inserted. */
SldInserter.prototype.insertValuesToConfig=function(fields, config_id) {
	var self=this;

    console.log("in wierd method");
    return(self.parseConfig(fields, config_id));

};

SldInserter.prototype.deleteConfig=function(id) {
    var self=this;
    return(self.db.queryResult('delete from sld_value where config_id='+id ));
};

SldInserter.prototype.getConfigOwner=function(id) {
    
try {
    var self=this;
    var sql = 'select uuid from sld_config where id='+id;
    console.log("getConfigOwner, sql: "+sql);
    
    return(self.db.queryResult(sql));
} catch(e) {
	console.log("Virhe "+e);
}
}



exports.check_config_ownership = function(config_id, client, cb) {
	var inserter=new SldInserter();
	var connected=inserter.connect(client);
	/*
		Check, if uuid matches the current uuid of the config in the db
		if not -> error
		else if admin, editing must be possible but uuid must still remain as it was? wtf...
	*/


	var result = [];
	console.log("Check ownership")
	var configOwnerQueried = connected.then(function() {
		return(inserter.getConfigOwner(config_id));
	});

	var ready = configOwnerQueried.then(function(res) {
		console.log("configOwnerQueried then "+res);
		result = res;
		return result;
	});

    ready.catch(function(err) {
    	console.log("ready catch "+err);
       // TODO: better management for empty result
       console.log("ready.catch "+err);
        if(result.length === 0){
           // Empty select
            cb(false,result);
        }
        else {
            cb(err, 0);
            console.error(err);
            return;
        }
    });

    ready.then(function() {
      console.log('success in check_config_ownership! '+result.length);
      cb(false,result);
    });



}


/** Main function, read template and store data to sld_styles db
 * @param params : [] output of sld parse function
 * @param sld_template: file name of template file
 * @param name  original sld file name
 * @param cb {function} status cb
 * */
exports.update_config = function(fields, uuid, client, cb) {

  console.log("Upadataing config");
  console.log("upadte_name: ", fields.name);
  console.log("update_id: ", fields.id);

  	var outputPath = 'Hubba/pubba/';
	var inserter=new SldInserter();
	var connected=inserter.connect(client);
    var deleted=connected.then(function() {
        return(inserter.deleteConfig(fields.id));
    });

	var configInserted=deleted.then(function() {
		console.log("using id: ",fields.id);
        config_id = fields.id;
		return(inserter.insertValuesToConfig(fields,config_id));
	});

	var ready=configInserted;

	ready.catch(function(err) {
		inserter.abort();
        cb(err, 0);
		return;
	});

	ready.then(function() {
		return(inserter.finish());
	}).then(function() {
		console.log('update config success');
        cb(false, config_id);
	}); 
}


