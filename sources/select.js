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
 * @return {Promise} */
SldSelecter.prototype.selectTemplate=function(id) {
    var self=this,
        sql = 'SELECT id,uuid,name,created,updated,wms_url, sld_filename FROM SLD_TEMPLATE';
    if (id > 0) sql = sql + ' WHERE ID='+id;
        return(self.db.queryResult( sql));
};

/** Select featuretypes of one template
 * @param {string/number} id  template id
 * @return {Promise} */
SldSelecter.prototype.selectFeaturetypes=function(id) {
    var self=this;
    return(self.db.queryResult('SELECT * FROM SLD_FEATURETYPE WHERE TEMPLATE_ID='+id));
};
/** Select rules of one template
 * @param {string/number} id  template id
 * @return {Promise} */
SldSelecter.prototype.selectRules=function(id) {
    var self=this;
    return(self.db.queryResult('SELECT ID, FEATURETYPE_ID, NAME, TITLE, ABSTRACT FROM ' +
        'SLD_RULE_VIEW WHERE TEMPLATE_ID='+id));
};

/** Select symbolizers of one template
 * @param {string/number} id  template id
 * @return {Promise} */
SldSelecter.prototype.selectSymbolizers=function(id) {
    var self=this;
    return(self.db.queryResult('SELECT ID, RULE_ID, SYMBOLIZER_ORDER AS ORDER, SYMBOLIZER_TYPE AS TYPE, UOM ' +
        'FROM SLD_SYMBOLIZER_VIEW WHERE TEMPLATE_ID='+id));
};

/** Select params of one template
 * @param {string/number} id  template id
 * @return {Promise} */
SldSelecter.prototype.selectParams=function(id) {
    var self=this;
    return(self.db.queryResult('SELECT  ID, SYMBOLIZER_ID, DEFAULT_VALUE, NAME, SYMBOLIZER_PARAMETER AS PARAM_PATH ' +
        'FROM SLD_PARAMS_VIEW WHERE TEMPLATE_ID='+id));
};
/** Roll back current transaction and close connection. */
SldSelecter.prototype.abort=function() {
    return(this.db.rollback()); //.then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldSelecter.prototype.finish=function() {
    return(this.db.commit()); //.then(bindToScope(this.db,this.db.close)));
};


/** Top function, to execute sql statement
 * @param {String} sql_template id
 * */
exports.select = function(id, client, cb) {

    console.log("in select");
	var selecter=new SldSelecter(),
        cb = cb,
        result = [];

	var connected=selecter.connect(client);

    var templateSelected=connected.then(function() {
        return(selecter.selectTemplate(id));
    });

    var ready = templateSelected.then(function (templateResult) {
       //Loop templates
            var ind = 0;
            var maxind = templateResult.length;
            var feaSelected = null;
            var ruleSelected = null;
            var symbolizerSelected = null;
            var paramSelected = null;
        templateResult.forEach(function(row){
            result.push(row);
            feaSelected = subSelectFeatures(ind, row.id);
            ruleSelected = subSelectRules(ind, row.id);
            symbolizerSelected = subSelectSymbolizers(ind, row.id);
            paramSelected = subSelectParams(ind, row.id);
            ind++;
        });
        return paramSelected;
    });

    function subSelectFeatures(ind, id) {
        var featuretypeSelected = selecter.selectFeaturetypes(id);
        var allSelected = featuretypeSelected.then(function (featureResult) {
            result[ind].sld_featuretypes = featureResult;

        });
        return allSelected;
    }

    function subSelectRules(ind, id) {
        var rulesSelected = selecter.selectRules(id);
        var allSelected = rulesSelected.then(function (featureResult) {
            result[ind].sld_rules = featureResult;

        });
        return allSelected;
    }

    function subSelectSymbolizers(ind, id) {
        var symsSelected = selecter.selectSymbolizers(id);
        var allSelected = symsSelected.then(function (featureResult) {
            result[ind].sld_symbolizers = featureResult;

        });
        return allSelected;
    }

    function subSelectParams(ind, id) {
        var paramsSelected = selecter.selectParams(id);
        var allSelected = paramsSelected.then(function (featureResult) {
            result[ind].sld_params = featureResult;

        });
        return allSelected;
    }

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
        console.log('Select success!');
        cb(false,result);
    });
};

