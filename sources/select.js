/** @fileoverview
  * This tool executes any sql select to PostgreSQL
  * database and returns result in json. Use like this:
  *
  *
  *                      */

var fs=require('fs');
var pg=require('pg.js');
var Promise = require('es6-promise').Promise;

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

/** @param {Object} conf Contains attributes:
  * host, port, database, user and password. */
PgDatabase.prototype.connect=function(conf) {
	var defer=new Deferred();

	this.client=new pg.Client(conf);
	this.client.connect(function(err) {
		if(err) return(defer.reject('Unable to connect to database: '+err));
		defer.resolve();
	});

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
  * SldSelecter executes slq select to
  *  an SQL database. */
var SldSelecter=function() {
	this.db=null;
	this.dbConf=null;
}

/** @param {string} dbPath Name of JSON file with database address and credentials. */
SldSelecter.prototype.connect=function(dbPath) {
	var defer=new Deferred();

	this.db=new PgDatabase();

	try {
		var dbJson=fs.readFileSync(dbPath,'utf-8');
		this.dbConf=JSON.parse(dbJson);
		defer.resolve();
	} catch(e) {
		defer.reject('Unable to read database configuration: '+e);
	}

	return(defer.promise.then(this.db.connect(this.dbConf)).then(this.db.begin()));
};

/** Roll back current transaction and close connection. */
SldSelecter.prototype.abort=function() {
	return(this.db.rollback().then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldSelecter.prototype.finish=function() {
	return(this.db.commit().then(bindToScope(this.db,this.db.close)));
};



/** @param {String} sql select
  * @return {Promise} */
SldSelecter.prototype.executeSql=function(query, cb) {
    this.db.client.query(query, cb);
};

/** Top function, to execute sql statement
 * @param {String} sql_template id
 * */
exports.select = function(id, cb) {
    var statement = 'SELECT * FROM SLD_TEMPLATE WHERE ID='+id;
	var selecter=new SldSelecter(),
        cb = cb;;

	var connected=selecter.connect('db.json');
    var cb2 = function(error, result) {
        if (error) cb(error, result);


        // Node Postgres parses results as JSON, but the JSON
        // we returned in `data` is just text.
        // So we need to parse the data object for all rows(n)
        /*    result.rows.map(function (row) {
         try {
         row.data = JSON.parse(row.data);
         } catch (e) {
         row.data = null;
         }

         return row;
         }); */

        cb(error, result.rows);
    };

	connected.then(function() {
		selecter.executeSql(statement,cb2);

	});


}

