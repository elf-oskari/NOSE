module.exports = function (app, path, parse, store) {
    var fs = require('fs'),
        formidable = require('formidable'),
        parse = parse,
        store = store,
        file_name = '',
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";


    // Upload route.
    app.post('/api/v1/sld_upload', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // `file` is the name of the <input> field of type `file`
            var old_path = files.sldfile.path,
                file_size = files.sldfile.size,
                file_ext = files.sldfile.name.split('.').pop(),
                index = old_path.lastIndexOf(path.sep) + 1;

            file_name = files.sldfile.name;
            console.log("fields", fields);
            console.log("file name", file_name);

            // sld parser and store cb is coming here
            var params = parse(old_path,
                function (params, err) {
                    console.log("params", params);

                    if (err) {
                        res.status(500);
                        res.json({'sld parse': 'failed for '+file_name});
                    } else {
                        store(params, 'sld_test_template.sld', file_name,
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