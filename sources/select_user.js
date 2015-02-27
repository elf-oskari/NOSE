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

/* PgDatabase.prototype.close=function(conf) {
	return(Promise.resolve(this.client.end()));
} */

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
  * UserSelecter executes slq select to
  *  an SQL database. */
var UserSelecter=function() {
	this.db=null;
}

/** @param {string} dbPath Name of JSON file with database address and credentials. */
UserSelecter.prototype.connect=function(client) {
    var defer=new Deferred();

    this.db=new PgDatabase();

    return(this.db.connect(client));  //.then(this.db.begin());
};

/** Select templates with all data
 * @param {string/number} id  template id
 *                        if  < 1  --> select all templates
 * @return {Promise} */
UserSelecter.prototype.selectUser=function(username) {
    var self=this,
        sql = 'SELECT id, uuid, \"user\", pw, role FROM SLD_USERS WHERE \"user\" = '+"\'"+username+"\';";

        console.log("selectUser, SQL: "+sql);
    return(self.db.queryResult( sql));
};

/** Roll back current transaction and close connection. */
UserSelecter.prototype.abort=function() {
    return(this.db.rollback()); //.then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
UserSelecter.prototype.finish=function() {
    return(this.db.commit()); //.then(bindToScope(this.db,this.db.close)));
};



/** Top function, to execute sql statement
 * @param {String} sql_template id
 * */
exports.select_user = function(username, client, callback) {
  console.log("in select_user "+username);
	var selecter=new UserSelecter(),
        callback = callback,
        result = [];

  	var connected=selecter.connect(client);

    var userSelected=connected.then(function() {
        return(selecter.selectUser(username));
    });

    var ready = userSelected.then(function (userResult) {
      
      userResult.forEach(function(row) {
        result.push(row);
      });

      return result;
      
    }); 

    ready.catch(function(err) {
       // TODO: better management for empty result
       console.log("ready.catch "+err);
        if(result.length === 0){
           // Empty select
            callback(false,result);
        }
        else {
            callback(err, 0);
            console.error(err);
            return;
        }

    });

    ready.then(function() {
      console.log('success in select_user!');
      callback(false,result);
    });
}

