module.exports = function(app, path, cb) {
    var fs = require('fs'),
        formidable = require('formidable'),
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";

  
 // Upload route.
app.post('/api/v1/sld_upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.sldfile.path,
            file_size = files.sldfile.size,
            file_ext = files.sldfile.name.split('.').pop(),
            index = old_path.lastIndexOf(path.sep) + 1,
            file_name = old_path.substr(index);
            //new_path = path.join(process.env.PWD, path.sep+'uploads+path.sep, file_name + '.' + file_ext);
            console.log("fields",fields);
            console.log("file name",file_name);
        fs.readFile(old_path, function(err, data, cb) {
            // sld parser and store cb is coming here
        
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'sld store': 'failed'});
                    } else {
                        res.status(200);
                        res.json({'sld store': 'success'});
                    }
                });
        });
    });
});
}