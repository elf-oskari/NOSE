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
var PgDatabase2 = require('./commondb');
var Deferred=require('./Deferred');
var filename = '';

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

    var ready=connected.then(function() {
        return(deletes.deleteConfig(id));
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
