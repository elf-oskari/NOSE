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
  * SldSelecter executes slq select to
  *  an SQL database. */
var SldSelecter=function() {
	this.db=null;
}

/** @param {string} dbPath Name of JSON file with database address and credentials. */
SldSelecter.prototype.connect=function(client) {
    var defer=new Deferred();

    this.db=new PgDatabase();

    return(this.db.connect(client));  //.then(this.db.begin());
};

/** Select templates with all data
 * @param {string/number} id  template id
 *                        if  < 1  --> select all templates
 * @param {string/number} uuid  userid id
 *                        if  == -1  -->admin: select all templates. Otherwise only configs of the user
 * @return {Promise} */
SldSelecter.prototype.selectConfig=function(id, uuid) {
    var self=this,
        sql = 'SELECT id,uuid,template_id,name,output_path,created,updated FROM SLD_CONFIG';

    if (id > 0) {
      sql = sql + ' WHERE ID='+id
      if (uuid != -1) {
        sql += ' AND uuid =\''+uuid+'\'';
      }
    } else if (uuid != -1) {
      sql = sql + ' WHERE uuid =\''+uuid+'\'';
    };

    console.log("selectConfig: SQL: ", sql);
    return(self.db.queryResult( sql));
};

/** Select featuretypes of one template
 * @param {string/number} id  template id
 * @return {Promise} */
SldSelecter.prototype.selectValues=function(id) {
    var self=this;

    var value_sql = 'SELECT a.param_id, c.name, a.value from SLD_VALUE as a, SLD_PARAM as b, SLD_TYPE as c  WHERE a.config_id='+id+' AND (a.param_id = b.id AND b.type_id = c.id)';
    console.log("value_sql: ", value_sql);

    return(self.db.queryResult(value_sql));
};

SldSelecter.prototype.selectRules=function(config_id) {
    var self = this;
    var sql = 'SELECT ID, FEATURETYPE_ID, NAME, TITLE, ABSTRACT, MINSCALEDENOMINATOR, MAXSCALEDENOMINATOR, CONFIG_ID, TEMPLATE_RULE_ID FROM ' +
        'SLD_RULE WHERE CONFIG_ID='+config_id;
    return(self.db.queryResult(sql));
};


/** Roll back current transaction and close connection. */
SldSelecter.prototype.abort=function() {
    return(this.db.rollback()); 
};

/** Commit current transaction and close connection. */
SldSelecter.prototype.finish=function() {
    return(this.db.commit()); 
};



/** Top function, to execute sql statement
 * @param {String} sql_template id
 * */
exports.select_config = function(id, uuid, client, cb) {


  console.log("in select_config "+uuid);

	var selecter=new SldSelecter(),
        cb = cb,
        ressu = {},
        result = [];

	var connected=selecter.connect(client);

    var configSelected=connected.then(function() {
        return(selecter.selectConfig(id, uuid));
    });

    var ready = configSelected;


    var ready = configSelected.then(function (configResult) {
        //Loop templates
        var ind = 0;
        var feaSelected = null;
        configResult.forEach(function(row){
            result.push(row);
            valuesSelected = subSelectValues(ind, row.id);
            rulesSelected = subSelectRules(ind, row.id);
            ind++;
        });
        return rulesSelected;
    });

    function subSelectValues(ind, id) {
        var featuretypeSelected = selecter.selectValues(id);
        var allSelected = featuretypeSelected.then(function (valueResult) {
            result[ind].sld_values = valueResult;
        });
        console.log("allSelected: ", allSelected);
        return allSelected;
    };

    function subSelectRules(ind, id) {
        var rulesSelected = selecter.selectRules(id);
        var allSelected = rulesSelected.then(function (featureResult) {
            result[ind].sld_rules = featureResult;
        });
        return allSelected;
    };

    ready.catch(function(err) {
       // TODO: better management for empty result
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
        console.log('success in select_config!');

        if(id != -1){
            console.log("id != -1: ", id);
            ressu = result[0];
            cb(false,ressu);
        }else{
            console.log("id == -1: ", id);
            cb(false,result);
        }

    });
}

