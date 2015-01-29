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
        LocalStrategy = require('passport-local').Strategy;

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


        //    var configOwnerUUID = null;
        //    return check_config_ownership(fields.id, client, callback);
 
            check_config_ownership(fields.id, client,function(err, result) {
                configOwnerUUID = result[0]['uuid'];
                console.log("Config id "+fields.id+" owner uuid "+result[0]['uuid']+" logged in user uuid "+uuid+" "+configOwnerUUID);
                if (uuid != configOwnerUUID) {
                    console.log("Different owner!");
                    //user is admin -> allow operation but use the existing uid. Otherwise send 401.
                    if (checkAdmin(req.user)) {
                        uuid = configOwnerUUID;
                        console.log("Admin editing somebody elses conf. Let him.")
                    } else {
                        res("401");
                    }

                }

                console.log('Getting this far? ', fields);
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






/*
    app.get('/login',
        function (req, res) {
            console.log("0");
            console.log(req.query.username);
            for (var key in req.params) {
                console.log("get: "+key+" "+req.params[key]);
            }
        },
        passport.authenticate('local', { failureRedirect:'/' }),
        function(req, res, next) {
            console.log('trying to redirect');
            res.render('application.html', {user: req.user ? req.user: null});                
        }
    );
*/    
