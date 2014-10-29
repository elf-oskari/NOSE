module.exports = function (app, path, client, libs) {

    var formidable = require('formidable'),
        parse = libs.parse.parse,
        store = libs.store.store,
        select = libs.select.select,
        delete_template = libs.delete_template.delete_template,
        delete_config = libs.delete_config.delete_config,
        client = client,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!",
        configIdCounter = 1,
        configs = [];


    app.get('/api/v1/templates/', function (req, res) {
        // TODO: refactor -1 to something more descriptive
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
    });

    // Upload route.
    app.post('/api/v1/templates/', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.sldfile.path,
                fname = files.sldfile.name,
                template_id = 0;
                tname = fields['tname'] || '';

            console.log("fields", fields);
            console.log("file name", fname);

            // sld parse and store to db
            parse(old_path, fname, tname,
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
                                        function(error, result) {
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

                });


        });
    });

    // Returns result of sql execution
    app.get('/api/v1/templates/:id', function(req, res) {
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

    app.delete('/api/v1/templates/:id', function(req, res) {
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

    app.delete('/api/v1/configs/:id', function(req, res) {
        console.log('DELETE /api/v1/configs/' +req.params.id);

        // temporary in memory stuff to remove deleted
        var deleteConfigId = req.params.id;
        configs = configs.filter(function (item) {
            return item.id !== deleteConfigId;
        });

        delete_config(req.params.id,
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

    app.get('/api/v1/configs/', function (req, res) {
        console.log('GET /api/v1/configs/');
        console.log('return in memory configs!', configs);
        res.status(200);
        res.json(configs);
    });

    app.put('/api/v1/configs/:id', function (req, res) {
        console.log('PUT /api/v1/configs/' +req.params.id);
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log('we got', fields);

            // update in memory configs
            var updateConfigId = req.params.id;
            configs.forEach(function(item, index, array) {
                if (item.id === updateConfigId) {
                    array[index] = fields;
                }
            })

            if (err) {
                res.status(500);
                res.json({"Error":err});
            } else {
                res.status(200);
                res.json(fields);
            }
        });
    });

    app.post('/api/v1/configs/', function (req, res) {
        console.log('POST /api/v1/configs/');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log('we got', fields);

            // add id
            fields.id = "" + configIdCounter++;
            configs.push(fields);

            if (err) {
                res.status(500);
                res.json({"Error":err});
            } else {
                res.status(200);
                res.json(fields);
            }
        });
    });
}