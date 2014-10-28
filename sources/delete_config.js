/** @fileoverview
  * This tool deletes a template and all it's child parametes from a PostgreSQL
  * database. Use like this:
  *
  * node store.js template.sld fields.csv
  *
 */

var fs=require('fs');
var pg=require('pg.js');
var Promise = require('es6-promise').Promise;
var filename = '';

/** @constructor
  * Deferred encapsulates a promise that gets fulfilled by outside code. */
var Deferred=function() {
	console.log(" deferred constructor");
	var self=this;

	this.promise=new Promise(function(resolve,reject) {
		self.resolve=resolve;
		self.reject=reject;
	});
	console.log("/deferred constructor");
};


/** Return a new function that calls fn making it see the desired scope
  * through its "this" variable.
  * @param {Object} scope Variable fn should see as "this".
  * @param {function()} fn Function to call. */
function bindToScope(scope, fn) {
	return function() {
		fn.apply(scope, arguments);
	};
	console.log("binided to scope");
};

/** @constructor
  * PostgreSQL database interface.
  * Simple wrapper to use promises with pg.js. */
var PgDatabase2=function() {
	this.client=null;
	console.log("done db constructor");
};

/** @param {Object} conf Contains attributes:
  * host, port, database, user and password. */
PgDatabase2.prototype.connect=function(conf) {

	console.log(" getting connection");

	var defer=new Deferred();

	this.client=new pg.Client(conf);
	this.client.connect(function(err) {
		if(err) return(defer.reject('Unable to connect to database: '+err));
		defer.resolve();
	});

	console.log("/getting connection");
	return(defer.promise);
}

PgDatabase2.prototype.close=function(conf) {
	return(Promise.resolve(this.client.end()));
}

/** Execute query without reading any results. */
PgDatabase2.prototype.exec=function() {
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
PgDatabase2.prototype.querySingle=function() {
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

/** Send query to database and read a single result row. */
PgDatabase2.prototype.queryResult=function() {
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


PgDatabase2.prototype.begin=function() {
	return(this.exec('BEGIN TRANSACTION'));
}

PgDatabase2.prototype.commit=function() {
	return(this.exec('COMMIT'));
}

PgDatabase2.prototype.rollback=function() {
	return(this.exec('ROLLBACK'));
}

/** @constructor
  * SldInserter stores a parsed SLD template and field configuration
  * into an SQL database. */
var SldDeleter=function() {
	console.log(" SLD deleter constructor");
	this.db=null;
	this.dbConf=null;
	console.log("/SLD deleter constructor");
}

/** @param {string} dbPath Name of JSON file with database address and credentials. */
SldDeleter.prototype.connect=function(dbPath) {
	console.log("connecting to db");
	var defer=new Deferred();

	this.db=new PgDatabase2();

	try {
		var dbJson=fs.readFileSync(dbPath,'utf-8');
		this.dbConf=JSON.parse(dbJson);
		defer.resolve();
	} catch(e) {
		defer.reject('Unable to read database configuration: '+e);
	}
	console.log("got connection");

	return(defer.promise.then(this.db.connect(this.dbConf)).then(this.db.begin()));
};

/** Roll back current transaction and close connection. */
SldDeleter.prototype.abort=function() {
	return(this.db.rollback().then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldDeleter.prototype.finish=function() {
	return(this.db.commit().then(bindToScope(this.db,this.db.close)));
};

/** Select templates with all data
 * @param {string/number} id  template id
 *                        if  < 1  --> select all templates
 * @return {Promise} */
SldDeleter.prototype.deleteConfig=function(id) {
    var self=this;
    return(self.db.queryResult('delete from sld_config where id='+id ));
};



/** Main function, read template and store data to sld_styles db
 * @param id  templates id to be deleted
 * @param cb {function} status cb
 * */
exports.delete_config = function(id, cb) {

	console.log("IN DELETE CONFIG....");
	var deletes=new SldDeleter(),
        cb = cb;

	var connected=deletes.connect('db.json');

	console.log("0 xxxxxxxxxx");
    var ready=connected.then(function() {
		console.log("1 xxxxxxxxxx");
        return(deletes.deleteConfig(id));
    });
	console.log("2 xxxxxxxxxx");
    console.log("READY: " , ready.toString());

	ready.catch(function(err) {
		deletes.abort();
		console.error(err);
		console.log(err);
		return;
	});

	ready.then(function() {
		return(deletes.finish());
	}).then(function() {
		console.log('Success!');
        cb(false);
	});

	console.log("DONE delete_config main function");
}
