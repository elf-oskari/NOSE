define([
    'lodash',
    'backbone',
    'jquery',
    'ol3',
    'i18n!localization/nls/SLDlist'
], function (_, Backbone, $, ol, locale) {
    var SLDMapView = Backbone.View.extend({
        className: 'map',
        uom:"metre",
        initialize: function (params) {
            this.dispatcher = params.dispatcher;
            this.listenTo(this.dispatcher, "resetVectorLayers", this.resetVectorLayers);
            this.listenTo(this.dispatcher, "updateMapStyleByParam", this.updateMapStyleByParam);
            this.listenTo(this.dispatcher, "updateMapStyle", this.updateMapStyle);
            this.listenTo(this.dispatcher, "all", this.logger);
            _.bindAll(this, 'render');
        },
        /**
         * @method resetVectorLayers
         * Hide the point, line and polygon layers by default (they get toggled on as needed when symbolizers of the rule are added)
         * Also reset the styles set previously
         */
        resetVectorLayers: function() {
            var self = this;
            this.params = null;
            if (this.map) {
                this.map.getLayers().forEach(function (l) {
                    if (l.get('title') == 'Polygons') {
                        l.setVisible(false);
                        l.setStyle(self.getPolygonOrLineStyle(null));
                    }
                    if (l.get('title') == 'Lines') {
                        l.setVisible(false);
                        l.setStyle(self.getPolygonOrLineStyle(null));
                    }                        
                    if (l.get('title') == 'Points') {
                        l.setVisible(false);
                        l.setStyle(self.getPointStyle(null));
                    }
                });
            }
        },

        /**
         * @method updateMapStyleByParam
         * update map style for only updated parameters of a given symbolizer for visible layer
         * Triggered in SLDEditor
         * @param {Object<json>} params; updated style parameters in UI.
         * @param {String} type; type of symbolizer.
         * @param {int} symbolizerId; id of the symbolizer
         */
        updateMapStyleByParam: function(newParams, type, symbolizerId) {
            var self = this;
            type = type.toLowerCase();
            if (this.params && this.params[type] && this.params[type][symbolizerId]) {

                _.each(newParams, function(item) {


                    //TODO: "elegantify" this...
                    var found = false;
                    for (var i = 0; i < self.params[type][symbolizerId].length; i++) {
                        if (item.name == self.params[type][symbolizerId][i].name) {
                            self.params[type][symbolizerId][i] = item;
                            found = true;
                        }
                    }
                    if (!found) {
                        self.params[type][symbolizerId].push(item);
                    }
                    
                });

            }
            this.setMapLayerStyle(type, true);

        },
        /**
         * @method updateMapStyle
         * update map style for one symbolizer for visible layer
         * Triggered in SLDEditor
         * @param {Object<json>} params; updated style parameters in UI.
         * @param {String} type; type of symbolizer.
         * @param {int} symbolizerId; id of the symbolizer
         */
        updateMapStyle: function (params, type, symbolizerId) {
            type = type.toLowerCase();
            if (!this.params) {
                this.params = {};
            }
            if (!this.params[type]) {
                this.params[type] = {};
            }

            this.params[type][symbolizerId] = params;
            this.setMapLayerStyle(type, true);
        },
        /**
         * @method setMapLayerStyle
         * Set or update map layer style for ol3 layers
         * @param {String} type; type of symbolizer.
         * @param {Boolean} update; true:update case, false: init case (sld template symbolizer default values).
         */
        setMapLayerStyle: function (type, update) {
            var self = this;
            if (this.map) {
                var polygons, points, lines, cur_style;
                this.map.getLayers().forEach(function (l) {
                    if (l.get('title') == 'Polygons') polygons = l;
                    if (l.get('title') == 'Lines') lines = l;
                    if (l.get('title') == 'Points') points = l;
                });
                if (polygons && type == 'polygonsymbolizer') {
                    var stylesArray = [];
                    if (update) {
                        for (var key in this.params[type]) {
                            var style = this.getPolygonOrLineStyle(null, this.params[type][key]);
                            stylesArray.push(style);
                        }
                    }
                    //no styles -> use default.
                    if (stylesArray.length === 0) {
                        stylesArray.push(polygons.getStyle());
                    }

                    polygons.setStyle(stylesArray);
                    polygons.setVisible(true);
                }
                else if (lines && type == 'linesymbolizer') {
                    var stylesArray = [];
                    if (update) {
                        for (var key in this.params[type]) {
                            var style = this.getPolygonOrLineStyle(null, this.params[type][key]);
                            stylesArray.push(style);
                        }
                    }
                    //no styles -> use default.
                    if (stylesArray.length === 0) {
                        stylesArray.push(lines.getStyle());
                    }
                    lines.setStyle(stylesArray);
                    lines.setVisible(true);
                }
                else if (points && type == 'pointsymbolizer') {
                    var stylesArray = [];
                    if (update) {
                        for (var key in this.params[type]) {
                            var style = this.getPointStyle(null, this.params[type][key]);
                            stylesArray.push(style);
                        }
                    }
                    //no styles -> use default.
                    if (stylesArray.length === 0) {
                        stylesArray.push(points.getStyle());
                    }
                    points.setStyle(stylesArray);
                    points.setVisible(true);
                }
                else if (type == 'textsymbolizer') {
                    var stylesArray = [];
                    if (update) {
                        for (var key in this.params[type]) {
                            var style = this.getPointTextStyle(null, this.params[type][key]);
                            stylesArray.push(style);
                        }
                    }
                    //no styles -> use default.
                    if (stylesArray.length === 0) {
                        stylesArray.push(points.getStyle());
                    }
                    points.setStyle(stylesArray);
                    points.setVisible(true);
                }
                

            }


        },
       /* Get style for polygons or lines
        * Replace ol3 style params defined in this.params array
        * and returns edited style for ol3 polygons or lines
        * ol3 style methods are not optimal - No set functions in ol3 style API ???
        * @param {Object} stylein;  current ol3 style
        * @return {Object} edited ol3 style  */
         getPolygonOrLineStyle: function (stylein, params) {
            // Default fill stroke params
            var def_params = {
                    'fill': 'rgba(255,255,255,0.0)',
                    'fill-opacity': 0.0,
                    'external-graphic': null,
                    'stroke': 'rgba(255,255,255,0.0)',
                    'stroke-opacity': 0.0,
                    'stroke-width': 1,
                    'stroke-linejoin': 'round',   // Line join style: `bevel`, `round`, or `miter`. Default is `round`.
                    'stroke-linecap': 'round',  //Line cap style: `butt`, `round`, or `square`. Default is `round`.
                    'stroke-dasharray-part': null,     // Line dash pattern. Default is `undefined` (no dash). array
                    'stroke-dashoffset': 10   //* Miter limit. Default is `10`. ??
                },
                style,
                fill,
                stroke,
                self = this;
            if (params) {
                params.forEach(function (param) {
                    if (param['name']) {
                        def_params[param['name']] = param['value'];
                    }  

                    // fix size unit
                    if (param['name'] === 'stroke-width') {
                        def_params[param['name']] = self.transformUnit(def_params[param['name']]);
                        if (def_params[param['name']] < 1)def_params[param['name']] = 1;
                    }
                });
            }



            // Create style
            fill = new ol.style.Fill({color: def_params['fill'], opacity: def_params['fill-opacity'] });
            stroke = new ol.style.Stroke({color: def_params['stroke'],
                width: Number(def_params['stroke-width']),
                lineJoin: def_params[ 'stroke-linejoin'],
                lineCap: def_params[ 'stroke-linecap'],
                lineDash: this.toDashArray(def_params[ 'stroke-dasharray-part']),
                miterlimit: Number(def_params[  'stroke-dashoffset'])});

            style = new ol.style.Style({
                stroke: stroke,
                fill: fill
            });


            return style;

        },
       /* Get style for ol3 points
        * Replace ol3 style params defined in this.params array
        * and returns edited style for ol3 points
        * ol3 style methods are not optimal - No set functions in ol3 style API ???
        * @param {Object} stylein;  current ol3 style
        * @return {Object} edited ol3 style   */
        getPointStyle: function (stylein, params) {
            // Default point params
            var def_params = {
                    'size': 1,
                    'opacity': 1.0,
                    'rotation': 0.0,
                    'onlineresource': null,
                    'wellknownname': 'circle',
                    'fill': 'rgba(255,255,255,0.0)',
                    'fill': 'rgba(255,255,255,0.0)',
                    'fill-opacity': 0.0,
                    'external-graphic': null,
                    'stroke': 'rgba(255,255,255,0.0)',
                    'stroke-opacity': 0.0,
                    'stroke-width': 1,
                    'stroke-linejoin': 'round',   // Line join style: `bevel`, `round`, or `miter`. Default is `round`.
                    'stroke-linecap': 'round',  //Line cap style: `butt`, `round`, or `square`. Default is `round`.
                    'stroke-dasharray-part': null,     // Line dash pattern. Default is `undefined` (no dash). array
                    'stroke-dashoffset': 10   //* Miter limit. Default is `10`. ??
                },
                style,
                fill,
                stroke,
                self = this;
            // pass updated value to current values
            if (stylein) def_params = this.getCurrentPointParams(def_params, stylein);

            if (params) {
                params.forEach(function (param) {
                    if (param['name']) {
                        def_params[param['name']] = param['value'];
                    }  

                    // fix size unit
                    if (param['name'] === 'size' || param['name'] === 'stroke-width') {
                        def_params[param['name']] = self.transformUnit(def_params[param['name']]);
                        if (def_params[param['name']] < 1)def_params[param['name']] = 1;
                    }
                });
            }

            // Create style
            fill = new ol.style.Fill({color: def_params['fill'], opacity: def_params['fill-opacity'] });
            stroke = new ol.style.Stroke({color: def_params['stroke'],
                width: Number(def_params['stroke-width']),
                lineJoin: def_params[ 'stroke-linejoin'],
                lineCap: def_params[ 'stroke-linecap'],
                lineDash: this.toDashArray(def_params[ 'stroke-dasharray-part']),
                miterlimit: Number(def_params[  'stroke-dashoffset'])});

            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: Number(def_params['size']),
                    fill: fill,
                    stroke: stroke
                })
            });


            return style;

        },
        /* Style for label text
         * Replace ol3 style params defined in this.params array
         * and returns edited style for ol3 polygons or lines
         * ol3 style methods are not optimal - No set functions in ol3 style ???
         * @param {Object} stylein;  current ol3 style
         * @return {Object} edited ol3 style  */
        getTextStyle: function (stylein, params) {
            // Default text params
            var def_params = { 'align': 'Center',
                    'baseline': 'Middle',
                    'font-size': '12px',
                    'pointplacement-displacementx': 0,
                    'pointplacement-displacementy': 0,
                    'font-weight': 'Normal',
                    'font-style': 'Normal',
                    'pointplacement-rotation': 0.0,
                    'font-family': 'Arial',
                    'text-fill': '#000000',
                    'fill': '#000000',
                    'outlineColor': 'black',
                    'outlineWidth': 0,
                    'text': 'Label text'},
                style,
                tstyle;

            // pass updated values
            if (stylein) {
                // get current values
                tstyle = stylein.getText();
                if (tstyle) def_params = this.getCurrentTextParams(def_params, tstyle);
            }
            if (params) {
                params.forEach(function (param) {
                    if (param['name']) {
                        def_params[param['name']] = param['value'];
                    }  
                    if (param['name'] === 'font-size' && param['name'].indexOf('px') === -1) def_params[param['name']] = def_params[param['name']] + 'px'
                });
            }

            styleProot = new ol.style.Text();

            style = new ol.style.Text({
                textAlign: def_params['align'],
                textBaseline: def_params['baseline'],
                //font-style font-variant font-weight font-size font-family
                font: def_params['font-style'] + ' Normal ' + def_params['font-weight'] + ' ' + def_params['font-size'] + ' ' + def_params['font-family'],
                text: def_params['text'],
                fill: new ol.style.Fill({color: def_params['fill']}),
                //stroke: new ol.style.Stroke({color: def_params['outlineColor'], width: def_params['outlineWidth']}),
                offsetX: def_params['pointplacement-displacementx'],
                offsetY: def_params['pointplacement-displacementy'],
                rotation: def_params['pointplacement-rotation']
            });
            return style;
        },
        /* Get style for ol3 points with labels
           * Replace ol3 style params defined in this.params array
            * and returns edited style for ol3 points with labels
            * @param {Object} stylein;  current ol3 style
            * @param {Object} params
            * @return {Object} edited ol3 style
         */
//        getPointTextStyle: function (stylein) {
        getPointTextStyle: function (stylein, params) {
            // add TextStyle - no set function in ol3 ???
            var style = new ol.style.Style({
                image: this.getPointStyle(stylein).getImage(),
//                text: this.getTextStyle(stylein)
                text: this.getTextStyle(stylein, params)
            });
            return style;
        },
        /* Transform size or width parameter value to pixels if unit is 'metre'
         * @param {String|Number} measure
         * @return {String|Number} measure
         */
        transformUnit: function (measure) {
            if (this.uom === 'metre') {
                measure = Number(measure) / this.map.getView().getResolution();
            }
            return measure;
        },
        /*
         * Converts string to dasharray for ol3
         * @return {Array<number>|undefined}
         * - 1st value is drawn dash length and second value is space between dashes
         * (unit is pixel)
         */
        toDashArray: function (str_array) {
            var dash;
            if (str_array instanceof Array) return str_array;
            if (str_array && str_array !== '') {
                dash = [];
                var ns = str_array.trim().split(' ');
                dash.push(Number(ns[0]));
                dash.push(ns.length > 1 ? Number(ns[1]) : 0);
            }
            return dash;
        },
        /*
         * Get current stroke style parameter values to params array
         * @param {Array/json} cur_params:  common style params (sld-editor UI-naming) (in/out)
         * @param {Object} style  current ol3 style
         */
        getCurrentStrokeParams: function (cur_params, style) {
            var stroke = style.getStroke();
            if (!stroke && style.getImage()) stroke = style.getImage().getStroke();

            if (stroke) {
                cur_params['stroke'] = stroke.getColor();
                cur_params['stroke-width'] = stroke.getWidth();
                cur_params[ 'stroke-linejoin'] = stroke.getLineJoin();   // Line join style: `bevel`, `round`, or `miter`. Default is `round`.
                cur_params[ 'stroke-linecap'] = stroke.getLineCap();  //Line cap style: `butt`, `round`, or `square`. Default is `round`.
                cur_params[ 'stroke-dasharray-part'] = stroke.getLineDash();     // Line dash pattern. Default is `undefined` (no dash). array
                cur_params[  'stroke-dashoffset'] = stroke.getMiterLimit();

            }

            return cur_params;
        },
        /*
         * Get current point(image) style parameter values to params array
         * @param {Array/json} cur_params:  common style params (sld-editor UI-naming) (in/out)
         * @param {Object} style  current ol3 style
         */
        getCurrentPointParams: function (cur_params, style) {
            var image = style.getImage();

            if (image) {
                if (image.getFill()) cur_params['fill'] = image.getFill().getColor();
                // getOpacity is not in ol3 if (image.getFill()) cur_params['fill-opacity'] = image.getFill().getOpacity();
                // if (image.getFill()) cur_params['opacity'] = image.getFill().getOpacity();
                cur_params['rotation'] = image.getRotation();
                cur_params['size'] = (!image.getRadius()) ? image.getSize()[1] : image.getRadius();
            }
            cur_params = this.getCurrentStrokeParams(cur_params, style);

            return cur_params;
        },
        /*
         * Get current polygon(fill) style parameter values to params array
         * @param {Array/json} cur_params:  common style params (sld-editor UI-naming) (in/out)
         * @param {Object} style  current ol3 style
         */
        getCurrentPolylineParams: function (cur_params, style) {
            var fill = style.getFill();

            if (fill) {
                cur_params['fill'] = fill.getColor();
                // cur_params['fill-opacity'] = fill.getOpacity();
                // cur_params['opacity'] = fill.getOpacity();

            }
            cur_params = this.getCurrentStrokeParams(cur_params, style);

            return cur_params;
        },
        /*
         * Get current text style parameter values to params array
         * @param {Array/json} cur_params:  common style params (sld-editor UI-naming) (in/out)
         * @param {Object} style  current ol3 style
         */
        getCurrentTextParams: function (cur_params, tstyle) {
            var fill = tstyle.getFill(),
                font = tstyle.getFont(),  // String "weight size font"
                stroke = tstyle.getStroke();

            cur_params.weight = font.trim().split(' ')[0];
            if (font.trim().split(' ').length > 1)cur_params['font-size'] = font.trim().split(' ')[1];
            if (font.trim().split(' ').length > 2)cur_params['font-family'] = font.trim().split(' ')[2];
            cur_params['fill'] = fill.getColor();
            cur_params['pointplacement-displacementx'] = tstyle.getOffsetX();
            cur_params['pointplacement-displacementy'] = tstyle.getOffsetY();
            cur_params['pointplacement-rotation'] = tstyle.getRotation();

            cur_params['text'] = tstyle.getText();
            cur_params['align'] = tstyle.getTextAlign();
            //cur_params['baseline'] = tstyle.getTextBaseline();
            //cur_params['outlineColor'] = stroke.getColor();
            //cur_params['outlineWidth'] = stroke.getWidth();

            return cur_params;
        },
        /*
         * Render ol3 map
         * init map with 4 layer and some map controls, if map is undefined
         * and add map to dom
         */
        render: function () {
            // create a map in the "map" div, set the view to a given place and zoom
            var self = this;

            //IE10 seems to lose map viewport content in some cases...So gotta check for that as well...sigh...
            if (!this.map || !this.map.getViewport() || this.map.getViewport().childNodes.length == 0) {

                console.log('render --Map');
                var vectorPolygons = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
                        url: 'data/geojson/polygon-samples.geojson'
                    }),
                    title: 'Polygons',
                    style: self.getPolygonOrLineStyle()
                });

                var vectorLines = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
                        url: 'data/geojson/line-samples.geojson'
                    }),
                    title: 'Lines',
                    style: self.getPolygonOrLineStyle()
                });

                var vectorPoints = new ol.layer.Vector({
                    source: new ol.source.GeoJSON({
                        projection: 'EPSG:3857',
                        url: 'data/geojson/point-samples.geojson'
                    }),
                    title: 'Points',
                    style: self.getPointStyle()
                });
                
                this.map = new ol.Map({
                    controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.MapQuest({layer: 'osm'}),
                            opacity: 0.5,
                            title: 'OSM'
                        }),
                        vectorPolygons,
                        vectorLines,
                        vectorPoints
                    ],
                    target: 'map',
                    view: new ol.View({
                        center: [2776000, 8444000],
                        zoom: 13
                    })
                });
                zoomslider = new ol.control.ZoomSlider();
                this.map.addControl(zoomslider);
                var layerSwitcher = new ol.control.LayerSwitcher();
                this.map.addControl(layerSwitcher);

                this.map.getView().on('change:resolution', function(event) {
                    self.mapResolutionChanged(event);
                });
            } else {
                // map node has been detached.
                // Note! event handling might not function properly, but since we currently do not have any map specific
                // event handling, this is not tested. Look at assign in SLDEditorPage for more details.
                //this.$el.replaceWith(this.map.getViewport());
                $(this.el).append(this.map.getViewport());

                //reset the previous styles and set vector layers invisible
                this.resetVectorLayers();
                // reset map view
                this.map.getView().setCenter([2776000, 8444000]);
                this.map.getView().setZoom(13);
                this.map.render();
            }
        },
        mapResolutionChanged: function(event) {

            var self = this;
            _.each(this.params, function(symbolizer, key) {
                self.setMapLayerStyle(key, true);
            });

        }
    });
    return SLDMapView;
});