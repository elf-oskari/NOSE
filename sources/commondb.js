


var pg=require('pg.js');
var Promise = require('es6-promise').Promise;
var Deferred=require('./Deferred');
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

module.exports = PgDatabase2;
