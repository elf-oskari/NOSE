module.exports = function (app, path, parse, store, select, delete_template) {
    var fs = require('fs'),
        formidable = require('formidable'),
        parse = parse,
        store = store,
        select = select,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";


    // Upload route.
    app.post('/api/v1/sld_upload', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.sldfile.path,
                fname = files.sldfile.name,
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
                        store(params, fname, tname, tfile,
                            function (err) {
                                if (err) {
                                    res.status(500);
                                    res.json({'sld store': 'failed'});
                                } else {
                                    res.status(200);
                                    res.json({'sld store': 'success'});
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


                // Node Postgres parses results as JSON, but the JSON
                // we returned in `data` is just text.
                // So we need to parse the data object for all rows(n)
                /*    result.rows.map(function (row) {
                 try {
                 row.data = JSON.parse(row.data);
                 } catch (e) {
                 row.data = null;
                 }

                 return row;
                 }); */

                res.json(result);
            }
        );


    });


    app.delete('/api/v1/:id/sld_upload_testit', function(req, res) {
        console.log('DELETE /api/v1/' + req.params.id +  '/sld_upload_testit');
        console.log(' #########  JOU  ###########'); 

        delete_template(req.params.id,
            function (err) {
                if (err) {
                    console.log("API ERROR!!!");
                    res.status(500);
                    res.json({'sld store': 'failed'});
                } else {
                    console.log("API SUCCESS!!!");
                    res.status(200);
                    res.json({'sld store': 'success'});
                }

            }            
        );

    });

}