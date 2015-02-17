module.exports = function (app, path, client, data, libs) {

    var formidable = require('formidable'),
        parse = libs.parse.parse,
        store = libs.store.store,
        select = libs.select.select,
        store_config_post = libs.store_config_post.store_config_post,

        select_user = libs.select_user.select_user,
        check_config_ownership = libs.update_config.check_config_ownership,

        select_config = libs.select_config.select_config,
        select_fields = libs.select_fields.select_fields,
        download_config = libs.download_config.download_config,
        delete_template = libs.delete_template.delete_template,
        delete_config = libs.delete_config.delete_config,
        update_config = libs.update_config.update_config,
        client = client,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!",
        configIdCounter = 1,
        configs = [],

        bodyParser = require('body-parser'),
        session = require('express-session'),
        passport = require('passport'), 
        LocalStrategy = require('passport-local').Strategy,

        http = require('http'),
        querystring = require('querystring'),
        fs = require('fs');

    var users = [];
    function findByUsername(username, fn) {
        select_user(username, client, function(error, result) {
            users = result;
            fn(null, users[0]);
        });
    }

    function findById(id, fn) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                fn(null, users[i]);
                return;
            }
        }
        fn(new Error('User ' + id + ' does not exist'));
    }
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.engine('html', require('ejs').renderFile);

    //read proxy settings
    var proxySettingsFile = fs.readFileSync(path.join(__dirname, '../proxy_config.json'),'utf-8');
    console.log('got file:', proxySettingsFile);
    var data = JSON.parse(proxySettingsFile);
    this.wmsProxyUrl = data.wmsProxyUrl;

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      findById(user.id, function (err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy(
      function(username, password, done) {
          // Find the user by username.  If there is no user with the given
          // username, or the password is not correct, set the user to `false` to
          // indicate failure and set a flash message.  Otherwise, return the
          // authenticated `user`.
          findByUsername(username, function(err, user) {

            console.log("passport find by username");
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            if (user.pw != password) { return done(null, false, { message: 'Invalid password' }); }
            return done(null, user);
          })
      }
    ));

    /*Check if user is admin and return boolean*/
    function checkAdmin(user) {
        console.log("checkAdmin user "+user.user+" role "+user.role);
        return user.role === "ADMIN";
    }

    /*admin check to be used in chained express callbacks*/
    function isAdmin(req, res, next) {
        if (req && req.user && req.user.role == "ADMIN") {
            next();
        } else {
            //TODO: some notification text as well?
            res.status(401).send("Unauthorized");
        }
    }

    function loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            setResLocation('/', res);
        }
    }

    function setResLocation (path, res) {
        var absolutePath = (data.baseUrl || '') + path;
        console.log('Redirecting to ' + absolutePath);
        //res.location(path);
        res.redirect(absolutePath);
    }

    app.post('/login', passport.authenticate('local', { failureRedirect:(data.baseUrl || '') +'/' }), function(req, res, next) {
        setResLocation('/application.html',res);
    });
    app.get('/application.html', loggedIn, function(req, res) {
        res.render('application.html', {user: req.user ? req.user: null});                
    });
    app.get('/logout', function(req, res){
        console.log("logging out user "+(req.user ? req.user.user : ""));
        req.logout();
        setResLocation('/', res);
    });

    app.get('/api/v1/templates/', loggedIn, function (req, res) {
        console.log('this fails ');
        // TODO: refactor -1 to something more descriptive
        try {
            select(-1, client,
                function(error, result) {
                    if (error) {
                        console.log('An error occurred:', error);
                        return res.send(500);
                    }
                    res.status(200);
                    res.json(result);
                }
            );
           } catch (e) {
                return res.send(500);
            }
    });

    // Upload route.
    app.post('/api/v1/templates/', loggedIn, isAdmin, function (req, res) {
        console.log("Upload SLD")
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.sldfile.path,
                fname = files.sldfile.name,
                template_id = 0;
            var tname = fields['tname'] || '';

            console.log("fields", fields);
            console.log("file name", fname);

            select_fields(client,
                function (error, rfields) {
                    if (error) {
                        console.log('An error occurred:', error);
                        return res.send(500);
                    }
                    console.log("result fields: ", rfields);

                    // sld parse and store to db
                    parse(old_path, fname, tname, rfields,
                        function (params, fname, tname, tfile, err) {
                            console.log("params", params);
                            if (err) {
                                res.status(500);
                                res.json({'sld parse': 'failed for sld file ' + fname});
                            } else {
                                store(params, client, fname, tname, tfile,
                                    function (err, template_id) {
                                        if (err || template_id === 0) {
                                            res.status(500);
                                            res.json({'sld store': 'failed'});
                                        } else {
                                            select(template_id, client,
                                                function (error, result) {
                                                    if (error) return res.send(500);
                                                    res.status(200);
                                                    // we assume there is just one and return that
                                                    res.json(result[0]);
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            );
        });
    });

    // Returns result of sql execution
    app.get('/api/v1/templates/:id', loggedIn, function(req, res) {
        console.log('GET /api/v1/templates/' + req.params.id);
        select(req.params.id, client,
            function(error, result) {
                if (error) {
                    console.log('An error occurred:', error);
                    return res.send(500);
                }
                res.status(200);
                res.json(result);
            }
        );
    });

    app.delete('/api/v1/templates/:id', loggedIn, isAdmin, function(req, res) {
        console.log('DELETE /api/v1/templates/' +req.params.id);

        delete_template(req.params.id,
            function (err) {
                if (err) {
                    console.log("API ERROR!!!", err);
                    res.status(500);
                    res.json({'delete template': 'failed'});
                } else {
                    console.log("API SUCCESS!!!");
                    // we cannot use 204 as it is not supported by Backbone
                    res.status(200);
                    res.json({});
                } 
            }            
        );
    });

    app.delete('/api/v1/configs/:id', loggedIn, function(req, res) {
        console.log('DELETE /api/v1/configs/' +req.params.id);

        /*in case of a regular user the uuid must also be provided to delete function.*/
        var uuid = checkAdmin(req.user) ? -1 : req.user.uuid;        
        
        //console.log(uuid+" "+req.user.uuid); return;
        delete_config(req.params.id, uuid, 
            function (err) {
                if (err) {
                    console.log("API ERROR!!!", err);
                    res.status(500);
                    res.json({'delete config': 'failed'});
                } else {
                    console.log("DELETE CONFIG API SUCCESS!!!");
                    // we cannot use 204 as it is not supported by Backbone
                    res.status(200);
                    res.json({});
                }
            }            
        );
    });


    app.get('/api/v1/configs/:id', loggedIn, function (req, res) {
        console.log('getting config with id');
        console.log('GET /api/v1/configs/' + req.params.id);

        /*in case of a regular user the uuid must also be provided -> only show the configs owned by user.*/
        var uuid = checkAdmin(req.user) ? -1 : req.user.uuid;        


        // TODO: refactor -1 to something more descriptive
        select_config(req.params.id, uuid, client,
            function(error, result) {
                if (error) {
                    console.log('An error occurred:', error);
                    return res.send(500);
                }

                //console.log("resultti: ", result);
                res.status(200);
                res.json(result);
            }
        );
    });

    // Download an SLD file
    app.get('/api/v1/configs/:id/download', loggedIn, function (req, res) {
        console.log('downloading sld file with id');
        console.log('GET /api/v1/configs/' + req.params.id);
        download_config(req.params.id, client,
            function(error, result) {
                if (error) {
                    console.log('An error occurred:', error);
                    return res.send(500);
                }
                console.log("result: ", result);
                res.status(200);
                res.setHeader('Content-disposition', 'attachment; filename=download.sld');
                res.setHeader('Content-type', 'text/plain; charset=utf-8');
                res.write(result);
                res.end();

                /*  download file from disk
                res.setHeader('Content-disposition', 'attachment; filename=download.sld');
                res.setHeader('Content-type', 'application/xml');
                res.download('db.json');
                */
            }
        );
    });



    //parses protocol, host and path from a given url
    //return {protocol:, host:, path:}
    function parseUrl(url) {

        var hostJSON = {};
        var urlSplit = url.split('://');
        var hostAndPath = "";
        if (urlSplit.length > 1) {
            //this.wmsProtocol = urlSplit[0];
            hostJSON.protocol = urlSplit[0];
            hostAndPath = urlSplit[1];
        } else {
            hostJSON.protocol = 'http';
            hostAndPath = urlSplit[0];
        }

        //url contains a path?
        if (hostAndPath.indexOf('/') > -1) {
            
            var hostPart = hostAndPath.substring(0, hostAndPath.indexOf('/'));
            var pathPart = hostAndPath.substring(hostAndPath.indexOf('/'), hostAndPath.length);
            var hostSplit = hostPart.split(':');
            
            hostJSON.host = hostSplit[0];
            hostJSON.port = hostSplit[1] ? hostSplit[1] : 80;
            hostJSON.path = pathPart;
        } else {
            var hostPart = hostAndPath;
            var pathPart = "";
            var hostSplit = hostPart.split(':');
            
            hostJSON.host = hostSplit[0];
            hostJSON.port = hostSplit[1] ? hostSplit[1] : 80;
            hostJSON.path = pathPart;
        }

        return hostJSON;
    }
    app.post('/wmspreview.html', loggedIn, function(req, res) {

//        console.log('POST /wmspreview.html '+req.body.id+" "+req.body.wmsUrl+" "+req.body.wmsHost+" "+req.body.wmsPath+" "+req.body.wmsPort+" "+req.body.wmsProxyHost+" "+req.body.wmsProxyPort);

        /*in case of a regular user the uuid must also be provided*/
        var uuid = (req.user && req.user.uuid) ? req.user.uuid : 0;        

        check_config_ownership(req.body.id, client,function(err, result) {
            configOwnerUUID = result[0]['uuid'];
            if (uuid != configOwnerUUID) {
                //user is admin -> allow operation but use the existing uid. Otherwise send 401.
                if (checkAdmin(req.user)) {
                    uuid = configOwnerUUID;
                } else {
                    res.status("401").send("");
                }
            }

            //owner or admin. Go ahead.
            if (uuid == configOwnerUUID) {
                var urlComponents = null;
                if (req.body.wmsUrl) {
                    urlComponents = parseUrl(req.body.wmsUrl);
                }

                if (!urlComponents) {
                    res.status(500).send("Bad url.");
                    return;
                } else {
                    this.wmsProtocol = urlComponents.protocol;
                    this.wmsPort = urlComponents.port;
                    this.wmsHost = urlComponents.host;
                    this.wmsPath = urlComponents.path;
                }

                if (this.wmsProxyUrl) {
                    console.log('FOUND wms proxy host '+this.wmsProxyUrl);
                    var proxyUrlComponents = parseUrl(this.wmsProxyUrl);
                    if (proxyUrlComponents) {
                        this.wmsProxyHost = proxyUrlComponents.host;
                        this.wmsProxyPort = proxyUrlComponents.port;
                    }
                } else {
                    console.log('no proxy url!!!');
                    this.wmsProxyHost = null;
                    this.wmsProxyPort = null;
                }
//                console.log("after parsing: "+this.wmsProtocol+" "+this.wmsHost+" "+this.wmsPath+" "+this.wmsProxyHost+" "+this.wmsProxyPort);

                if (req.body.username && req.body.password) {
                    this.wmsUserName = req.body.username;
                    this.wmsUserPassword = req.body.password;
                } else {
                    this.wmsUserName = null;
                    this.wmsUserPassword = null;
                }

                res.render("wmspreview.html", {
                    id: req.body.id ? req.body.id : null
                });

            }
        });

    });

    //get the sld xml for config
    app.post('/api/v1/configs/:id/wmspreview', loggedIn, function(req, res) {
            console.log('app.post(/api/v1/configs/:id/wmspreview');
            var self = this;
            download_config(req.params.id, client, function(error, result) {
                if (result) {
                    //get rid of the <?undefined ... xml declaration
                    try {
                        self.xml = result.substring(result.indexOf('<StyledLayerDescriptor'), result.length);
                    } catch(e) {
                        console.log(e);
                    }
                    res.status(200);
                    res.send("");
                } else {
                    res.status(500);
                    res.send("");
                }
            });

    });

    app.get('/api/v1/configs/:id/wmspreview/getmap', function(req, res) {
        //console.log("/api/v1/configs/:id/wmspreview/getmap "+req.query.id);
        var dataParams = {};
        for (var key in req.query) {
            dataParams[key] = req.query[key];
        }
        dataParams.SLD_BODY = this.xml;
        var query = querystring.stringify(dataParams);
        
        var options = {};
        var authorizationString = null;
        if (this.wmsUserName && this.wmsUserPassword) {
            authorizationString  = new Buffer(this.wmsUserName+":"+this.wmsUserPassword).toString('base64');
        }

//        console.log("Authentication? "+this.wmsUserName+" "+this.wmsUserPassword+" "+authorizationString);

        //use proxy
        if (this.wmsProxyHost) {
  
            console.log("using proxy")          
            var pathString = 'http://'+this.wmsHost;
            var pathString = this.wmsProtocol+'://'+this.wmsHost;
            if (this.wmsPort) {
                pathString += ":"+this.wmsPort;
            }
            pathString += this.wmsPath+'?'+query

            var hostString = this.wmsHost;
            if (this.wmsPort) {
                hostString += ":"+this.wmsPort;
            }
            hostString += '/'+this.wmsPath
//            console.log("pathstring: "+pathString+" hostString "+hostString); 
            options = {
              host: this.wmsProxyHost,
              port: this.wmsProxyPort ? this.wmsProxyPort : 80,
              path: pathString,
              method: 'POST',
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Content-Length': Buffer.byteLength(query),
                 'Host':hostString

              }
            };
        } else {
            //no proxy
            options = {
              host: this.wmsHost,
              path: this.wmsPath,
              port: this.wmsPort ? this.wmsPort: 80,
              method: 'POST',
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Content-Length': Buffer.byteLength(query),
              }
            };
        }

        if (authorizationString) {
            options.headers['Authorization'] = 'Basic '+authorizationString;
        }

        var response = [];
        var request = http.request(options, function(resp){
          resp.on('data', function(chunk){
            response.push(chunk);
          });

          resp.on('end', function() {
            var buffer = Buffer.concat(response);
            res.status(200).send(buffer);
          })
        }).on("error", function(e){
          console.log("Got error: " + e.message);
          res.send();
        });

        //POST
        request.write(query);
        request.end();
    });


    app.get('/api/v1/configs/', loggedIn, function (req, res) {
        console.log('getting config without id --> ALL');
        console.log('GET /api/v1/configs/');

        /*in case of a regular user the uuid must also be provided -> only show the configs owned by user.*/
        var uuid = checkAdmin(req.user) ? -1 : req.user.uuid;        

        console.log("UUID? "+uuid);
        select_config(-1, uuid, client,
            function(err, result) {
                if (err) {
                    console.log('An error occurred:', error);
                    return res.send(500);
                }

                //console.log("config ALL result: ", result);
                console.log("config ALL DONE!!");
                res.status(200);
                res.json(result);
            }
        );

    });

    app.put('/api/v1/configs/:id', loggedIn, function (req, res) {
        console.log('PUT /api/v1/configs/' +req.params.id);

        /*in case of a regular user the uuid must also be provided*/
        var uuid = (req.user && req.user.uuid) ? req.user.uuid : 0;        
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {


            check_config_ownership(fields.id, client,function(err, result) {
                configOwnerUUID = result[0]['uuid'];
                console.log("Config id "+fields.id+" owner uuid "+result[0]['uuid']+" logged in user uuid "+uuid+" "+configOwnerUUID);
                if (uuid != configOwnerUUID) {
                    //user is admin -> allow operation but use the existing uid. Otherwise send 401.
                    if (checkAdmin(req.user)) {
                        uuid = configOwnerUUID;
                    } else {
                        res("401");
                    }

                }

                update_config(fields, uuid, client,
                    function (err) {
                        if (err) {
                            console.log("API ERROR!!!", err);
                            res.status(500);
                            res.json({'delete template': 'failed'});
                        } else {
                            console.log("API SUCCESS!!!");
                            // we cannot use 204 as it is not supported by Backbone
                            res.status(200);
                            res.json({});
                        }
                    } 
                );           



            });


        });
    });

    app.post('/api/v1/configs/', loggedIn, function (req, res) {
        console.log('POST /api/v1/configs/');

        var uuid = (req.user && req.user.uuid) ? req.user.uuid : -1;

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log('we got', fields);

            // add id
            fields.id = "" + configIdCounter++;
            console.log("POST YYY", fields.name);
            var lista = fields.sld_values;

            for (var i = lista.length - 1; i >= 0; i--) {
                console.log("G: ", lista[i])
            }

            store_config_post(fields, uuid, client,
                function (err, result_id) {
                    if (err) {
                        console.log("API ERROR!!!", err);
                        res.status(500);
                        res.json({'delete template': 'failed'});
                    } else {
                        console.log("API SUCCESS!!! for 3 -->:",result_id);
                        /*in case of a regular user the uuid must also be provided -> only show the configs owned by user.*/
                        var uuid = checkAdmin(req.user) ? -1 : req.user.uuid;        
                        select_config(result_id, uuid, client,
                            function(err, result) {
                                if (err) {
                                    console.log('An error occurred:', error);
                                    return res.send(500);
                                }

                                //console.log("config.post.result: ", result);
                                res.status(200);
                                res.json(result);
                            }
                        );
                    }
                } 
            );  
        });
    });

app.get('*', loggedIn, function(req, res) {
  console.log('Unhandled url', req.url);
  res.status(404);
});
};

