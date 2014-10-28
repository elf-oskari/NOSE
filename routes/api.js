module.exports = function (app, path, client, libs) {

    var formidable = require('formidable'),
        parse = libs.parse.parse,
        store = libs.store.store,
        select = libs.select.select,
        delete_template = libs.delete_template.delete_template,
        delete_config = libs.delete_config.delete_config,
        client = client,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";


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
    var configs = [
        {
            "id":"435",
            "uuid":"17742-caa42-a34e4-a3ff3",
            "name":"Kivatyyli_oma_sld",
            "template_id":"265",
            "output_path":"null",
            "created":"2014-02-09 11:14:46.08888+03",
            "updated":"2014-02-09 11:14:46.08888+03",
            "wms_url":"#????#",
            "sld_values": [
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"1273",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"1288",
                    "data":"2"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"??",
                    "data":"#c832d8"
                },

            ],
        },
        {
            "id":"436",
            "uuid":"17742-caa42-a34e4-a3ff3",
            "name":"Kivatyyli_oma_sld2",
            "template_id":"265",
            "output_path":"null",
            "created":"2014-02-09 11:14:46.08888+03",
            "updated":"2014-02-09 11:14:46.08888+03",
            "wms_url":"#????#",
            "sld_values": [
                {
                    "id":"123242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                },
                {
                    "id":"243242",
                    "config_id":"435",
                    "param_id":"",
                    "data":"#c832d8"
                }
            ]
        }
    ];
        console.log('get configs!');
        res.status(200);
        res.json(configs);
    });

}