module.exports = function (app, path, parse, store) {
    var fs = require('fs'),
        formidable = require('formidable'),
        parse = parse,
        store = store,
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";


    // Upload route.
    app.post('/api/v1/sld_upload', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.sldfile.path,
                fname = files.sldfile.name;

            console.log("fields", fields);
            console.log("file name", fname);

            // sld parse and store to db
            parse(old_path, fname,
                function (params, fname, err) {
                    console.log("params", params);

                    if (err) {
                        res.status(500);
                        res.json({'sld parse': 'failed for ' + fname});
                    } else {
                        store(params, 'sld_test_template.sld', fname,
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
}