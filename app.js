/**
 * Module dependencies.
 */

var express = require('express'),
    app = express();
var http = require('http');
var path = require('path');

//var mongo = require('mongodb');
//var fs = require('fs');

var environment = process.env.NODE_ENV || 'development';
var publicDir = path.join(__dirname, 'public');
// all environments
app.set('port', process.env.PORT || 3300);

// disable layout
app.set("view options", {layout: false});

//app.use(express.favicon());
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
  // use development db
  //app.use(express.errorHandler());
//}


// DB
//var db = new mongo.Db('sld', new mongo.Server('localhost', 27017, {auto_reconnect: true}));
//var ObjectID = mongo.BSONPure.ObjectID;

// pass in all dependency references
//var routes = require('./routes/api')(app, db, ObjectID, credentials);
var parse =  require('./sources/parse');
var store =  require('./sources/store');
var delete_template =  require('./sources/delete_template');
var select =  require('./sources/select');
var routes = require('./routes/api')(app, path, parse.parse, store.store, select.select, delete_template.delete_template);


// the startup sequence is async, therefore start the server only if everything else also works
//function startServer() {
    //http.createServer(app).listen(app.get('port'), function(){
      //console.log('Express server listening on port ' + app.get('port'));
    //});
//}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});