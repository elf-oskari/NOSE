module.exports = function(app, db, ObjectID, credentials) {
    var fs = require('fs'),
        agent = require('superagent'),
        sldCollection = 'slds',
        errorMessage = "We are working on the problem, please try again later. Thanks for understanding!";

    // Initialize layer name and template
    var layerName = "ows:mtkgml_kunnanhallintoraja";
    var template = fs.readFileSync('templates/sld.xml', 'utf8');

    // Helper function to pipe data
    // https://github.com/visionmedia/superagent/issues/194
    function pipeHelper(response) {
        return function(res, callback) {
            res.pipe(response);
            res.on('end', function(a,b) {
                response.end();
                callback(a,b);
            })
        }
    }

    function modelHelper(newsld) {
        var sld = {
            "point" : {
                visible: !!newsld.point.visible,
                color: newsld.point.color,
                size: newsld.point.size
            },
            "line" : {
                visible: !!newsld.line.visible,
                color: newsld.line.color,
                size: newsld.line.size
            },
            "polygon" : {
                visible: !!newsld.polygon.visible,
                color: newsld.polygon.color
            }
        };
        return sld;
    }

    app.get('/api/layers/1/styles', function(req, res) {
        console.log("GET /api/layers/1/styles/");
        db.collection(sldCollection, function(err, collection) {
            collection.find().toArray(function(err, items) {
                if (items) {
                    res.send(200, items);
                } else {
                    console.log('Error occurred\n', err);
                    res.send(500, errorMessage);
                }
            });
        });
    });

    app.post('/api/layers/1/styles', function(req, res) {
        console.log("POST /api/layers/1/styles/");
        // populate model
        var newsld = req.body,
            sld = modelHelper(newsld);
        // TODO: verify model before persisting

        db.collection(sldCollection, function(err, collection) {
            collection.insert(sld, {}, function(err, result) {
                if (result) {
                    res.send(200, result);
                } else {
                    console.log('Error occurred\n', err);
                    res.send(500, errorMessage);
                }
            });
        });
    });

    // Changes sld values
    app.put('/api/layers/1/styles/:id/edit', function(req, res) {
        console.log("PUT /api/layers/1/styles/" + req.params.id +  "/edit");
        // populate model
        var newsld = req.body,
            id = new ObjectID(newsld._id),
            sld = modelHelper(newsld);
        // TODO: verify model before persisting

        db.collection(sldCollection, function(err, collection) {
            collection.update({_id: id}, {$set : sld}, {safe : true, multi : false}, function(err, result) {
                if (result === 1) {
                    res.send(200, 'OK');
                } else {
                    console.log('Error occurred\n', err);
                    res.send(500, errorMessage);
                }
            });
        });
    });

    // Returns png image rendered by geoserver
    app.get('/api/layers/1/styles/:id/image', function(req, res) {
        console.log("GET /api/layers/1/styles/" + req.params.id +  "/image");
        var hostname = req.headers.host,
            sldPath = "/api/layers/1/styles/" + req.params.id + "/sld",
            address = 'http://' + hostname + sldPath,
            geoserver = 'http://' + credentials + '@nipsuke02.nls.fi:8080/geoserver/ows/wms';

        var url = geoserver + '?service=WMS&version=1.1.0&request=GetMap&layers=' + layerName + '&styles=&bbox=200000.84327208286,6800000.282915555,300000.649760254,6900000.827740312&width=512&height=512&srs=EPSG:3067&format=image%2Fpng&SLD=' + address;
        agent
            .get(url)
            .parse(pipeHelper(res))
            .end();
    });

    function sldHelper() {
        // Remove all line endings and clone string at the same time
        return template.replace(/(\r|\n)*/g, '');
    }

    app.get('/api/layers/1/styles/:id/sld', function(req, res){
        console.log("GET /api/layers/1/styles/" + req.params.id +  "/sld");
        var id = new ObjectID(req.params.id);

        db.collection(sldCollection, function(err, collection) {
            collection.findOne({_id: id}, function(err, item) {
                if (item) {
                    var sld = sldHelper();

                    // set layer name
                    sld = sld.replace(/\{layerName\}/, layerName);

                    // Point handling
                    if (item.point.visible) {
                        // remove only section tags
                        sld = sld.replace(/\{pointRule(Start|End)\}/g, '');

                        // fill in line color
                        sld = sld.replace(/\{pointRuleColor\}/, item.point.color);

                        // fill in line size
                        sld = sld.replace(/\{pointRuleSize\}/, item.point.size);
                    } else {
                        // remove section tags with content
                        sld = sld.replace(/\{pointRuleStart\}.*\{pointRuleEnd\}/g, '');
                    }

                    // Line handling
                    if (item.line.visible) {
                        // remove only section tags
                        sld = sld.replace(/\{lineRule(Start|End)\}/g, '');

                        // fill in line color
                        sld = sld.replace(/\{lineRuleColor\}/, item.line.color);

                        // fill in line size
                        sld = sld.replace(/\{lineRuleSize\}/, item.line.size);
                    } else {
                        // remove section tags with content
                        sld = sld.replace(/\{lineRuleStart\}.*\{lineRuleEnd\}/g, '');
                    }

                    // Polygon handling
                    if (item.polygon.visible) {
                        // remove only section tags
                        sld = sld.replace(/\{polygonRule(Start|End)\}/g, '');

                        // fill in line color
                        sld = sld.replace(/\{polygonRuleColor\}/, item.polygon.color);
                    } else {
                        // remove section tags with content
                        sld = sld.replace(/\{polygonRuleStart\}.*\{polygonRuleEnd\}/g, '');
                    }

                    res.set('Content-Type', 'application/xml');
                    res.send(200, new Buffer(sld));
                } else {
                    console.log('Error occurred\n', err);
                    res.send(500, errorMessage);
                }
            });
        });
    });
}