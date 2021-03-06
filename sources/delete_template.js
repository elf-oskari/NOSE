/** @fileoverview
  * This tool deletes a template and all it's child parametes from a PostgreSQL
  * database. Use like this:
  *
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
	console.log("binded to scope");
};

/** @constructor
  * PostgreSQL database interface.
  * Simple wrapper to use promises with pg.js. */
var PgDatabase=function() {
	this.client=null;
	console.log("done db constructor");
};

/** @param {Object} conf Contains attributes:
  * host, port, database, user and password. */
PgDatabase.prototype.connect=function(client) {
	var defer=new Deferred();

	this.client=client;
    defer.resolve();

	return(defer.promise);
}

PgDatabase.prototype.close=function(conf) {
	return(Promise.resolve(this.client.end()));
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

/** Send query to database and read a single result row. */
PgDatabase.prototype.queryResult=function() {
	console.log("queryResult, this.client", this.client, "arguments", arguments)
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

/** @constructor */
var SldDeleter=function() {
	console.log(" SLD deleter constructor");
	this.db=null;
	this.dbConf=null;
	console.log("/SLD deleter constructor");
}

/** @param {string} dbPath Name of JSON file with database address and credentials. */
SldDeleter.prototype.connect=function(client) {
	console.log("connecting to db");
	var defer=new Deferred();

	this.db=new PgDatabase();

	console.log("got connection");

	return(this.db.connect(client)).then(this.db.begin());
};

/** Roll back current transaction and close connection. */
SldDeleter.prototype.abort=function() {
	return(this.db.rollback());
	//.then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldDeleter.prototype.finish=function() {
	return(this.db.commit());
	//.then(bindToScope(this.db,this.db.close)));
};

/** Select templates with all data
 * @param {string/number} id  template id
 *                        if  < 1  --> select all templates
 * @return {Promise} */
SldDeleter.prototype.selectTestDelete=function(id) {
    var self=this;
    return(self.db.queryResult('delete from sld_template where id='+id ));
};



/** Main function, read template and store data to sld_styles db
 * @param id  templates id to be deleted
 * @param cb {function} status cb
 * */
exports.delete_template = function(client, id, cb) {

	console.log("IN DELETE TEMPLATE...., client:", client);
	var deletes=new SldDeleter(),
        cb = cb;

	var connected=deletes.connect(client);
    var ready=connected.then(function() {
        return(deletes.selectTestDelete(id));
    });
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
	console.log("DONE delete_tempalte main function");
}


