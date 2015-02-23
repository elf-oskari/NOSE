/** @fileoverview
  * This tool deletes a config from a PostgreSQL
  * database.
  *
 */

var fs=require('fs');
var pg=require('pg.js');
var Promise = require('es6-promise').Promise;
var filename = '';

/** @constructor
  * Deferred encapsulates a promise that gets fulfilled by outside code. */
var Deferred=function() {
	var self=this;

	this.promise=new Promise(function(resolve,reject) {
		self.resolve=resolve;
		self.reject=function(err, arg ) {
            console.log(err);
            if(arg) console.log(arg[0]);

        }
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
}

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

    defer.resolve();

	return(defer.promise);
};

PgDatabase.prototype.close=function(conf) {
	return(Promise.resolve(this.client.end()));
};

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
};

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
		if(!result) return(defer.reject('Not found: ',arguments));
		defer.resolve(result);
	});

	return(defer.promise);
};

/** Send query to database and read a single result row. */
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
};

PgDatabase.prototype.commit=function() {
	return(this.exec('COMMIT'));
};

PgDatabase.prototype.rollback=function() {
	return(this.exec('ROLLBACK'));
};

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
 * @param {string/number} uuid  user id
 *                        if   == -1  -> admin user, always allow delete
 * @return {Promise} */
SldDeleter.prototype.deleteConfig=function(id, uuid) {
    var self=this;
    var sql = 'delete from sld_config where id='+id;
    if (uuid && uuid != -1) {
    	sql += " AND uuid = \'"+uuid+"\'";
    }
    console.log("deleteConfig: sql "+sql)
    return(self.db.queryResult(sql));

//    return(self.db.queryResult('delete from sld_config where id='+id ));
};



/** Main function, read template and store data to sld_styles db
 * @param id  templates id to be deleted
 * @param cb {function} status cb
 * */
exports.delete_config = function(client, id, uuid, cb) {

	console.log("IN DELETE CONFIG....");
	var deletes=new SldDeleter(),
        cb = cb;

	var connected=deletes.connect(client);

    var ready=connected.then(function() {
        return(deletes.deleteConfig(id, uuid));
    });
    console.log("READY: " , ready);

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
