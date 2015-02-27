/** @fileoverview
  * This tool executes an SQL select to PostgreSQL
  * database and returns resulted field list in JSON. */

var fs = require('fs');
var pg = require('pg.js');
var Promise = require('es6-promise').Promise;

/** @constructor
 * Deferred encapsulates a promise that gets fulfilled by outside code. */
var Deferred = function () {
    var self = this;

    this.promise = new Promise(function (resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
    });
};

/** Return a new function that calls fn making it see the desired scope
 * through its "this" variable.
 * @param {Object} scope Variable fn should see as "this".
 * @param {function()} fn Function to call. */
function bindToScope(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/** @constructor
 * PostgreSQL database interface.
 * Simple wrapper to use promises with pg.js. */
var PgDatabase = function () {
    this.client = null;
};

/** @param {Object} client:
 * host, port, database, user and password. */
PgDatabase.prototype.connect = function (client) {
    var defer = new Deferred();

    this.client = client;
    defer.resolve();
    return (defer.promise);
};

/** Execute query without reading any results. */
PgDatabase.prototype.exec = function () {
    var query = this.client.query.apply(this.client, arguments);
    var defer = new Deferred();

    query.on('error', function (err) {
        defer.reject(err);
    });

    query.on('end', function (state) {
        defer.resolve(state);
    });

    return (defer.promise);
};

/** Send query to database and read a single result row. */
PgDatabase.prototype.queryResult = function () {
    var query = this.client.query.apply(this.client, arguments);
    var defer = new Deferred();
    var result = [];

    query.on('row', function (row) {
        result.push(row);
    });

    query.on('error', function (err) {
        defer.reject(err);
    });

    query.on('end', function (state) {
        if (!result) return (defer.reject('Not found'));
        defer.resolve(result);
    });

    return (defer.promise);
};

PgDatabase.prototype.begin = function () {
    return (this.exec('BEGIN TRANSACTION'));
};

PgDatabase.prototype.commit = function () {
    return (this.exec('COMMIT'));
};

PgDatabase.prototype.rollback = function () {
    return (this.exec('ROLLBACK'));
};

/** @constructor
 * FieldSelector executes slq select to
 * an SQL database. */
var FieldSelector = function () {
    this.db = null;
};

/** @param {string} client Name of JSON file with database address and credentials. */
FieldSelector.prototype.connect = function (client) {
    var defer = new Deferred();

    this.db = new PgDatabase();

    return (this.db.connect(client));
};
/**
 * Read parameter values from database
 * @param id config id
 * @returns {Promise}
 */
FieldSelector.prototype.readFields = function() {
    var self = this,
        sql = 'SELECT search_tag FROM sld_type ORDER BY id';
    console.log("readFields SQL: ", sql);
    return (self.db.queryResult(sql));
};

/** Roll back current transaction and close connection. */
FieldSelector.prototype.abort = function () {
    return (this.db.rollback());
};

/** Commit current transaction and close connection. */
FieldSelector.prototype.finish = function () {
    return (this.db.commit());
};

/** Top function, to execute sql statement
 */
exports.select_fields = function (client, cb) {

    console.log("in select_fields");

    var selector = new FieldSelector(),
        callback = cb;

    var connected = selector.connect(client);

    // Read parameter values
    var ready = connected.then(function () {
        return (selector.readFields());
    });

    ready.catch(function (err) {
        console.error(err);
    });

    ready.then(function(readyResult) {
        var i;
        var result = [];
        // Convert result to JSON object
        for (i=0; i<readyResult.length; i++) {
            result.push(JSON.parse('{"path":['+readyResult[i].search_tag+']}'));
        }
        console.log('Select fields success!');
        callback(false, result);
    });
};

