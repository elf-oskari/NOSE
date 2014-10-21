module.exports = function (app, path, client, parse, store, select) {
    var fs = require('fs'),
        formidable = require('formidable'),
        parse = parse,
        store = store,
        select = select,
        client = client,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";


    // Upload route.
    app.post('/api/v1/sld_upload', function (req, res) {
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
                                    select(template_id,
                                        function(error, result) {
                                            if (error) return res.send(500);
                                            res.status(200);
                                            res.json(result);
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
    app.get('/api/v1/select/:id/sld_template', function(req, res) {
        console.log('GET /api/v1/select/' + req.params.id +  '/sld_template');
        select(req.params.id,
            function(error, result) {
                if (error) return res.send(500);

                res.json(result);
            }
        );


    });
}