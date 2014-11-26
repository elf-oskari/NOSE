define([
  'lodash',
  'backbone',
  'jquery',
  'ol3',
  'i18n!localization/nls/SLDlist'
], function(_, Backbone, $, ol, locale) {
  var SLDMapView = Backbone.View.extend({
    className: 'map',
    initialize: function(params) {
        this.dispatcher = params.dispatcher;
        this.listenTo(this.dispatcher, "selectSymbolizer", this.setParams2MapStyle);
        this.listenTo(this.dispatcher, "all", this.logger);
      _.bindAll(this, 'render');
    },
      /**
       * @method setParams2MapStyle
       * Set map style for one symbolizer
       */
      setParams2MapStyle: function(params, type) {
          console.log('setParams2MapStyle', params);
          this.params = params;
          console.log('setParams2MapStyle', params, ' type: ', type);
          if(this.map)
          {
              var polygons, points, lines;
              this.map.getLayers().forEach(function (l)
              {
                if (l.get('title') == 'Polygons') polygons = l;
                if (l.get('title') == 'Lines') lines = l;
                if (l.get('title') == 'Points') points = l;
              });
              if(polygons && type =='polygonsymbolizer') {
                  polygons.setStyle(this.createPolygonStyleFunction());
                  polygons.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(points) points.setVisible(false);
              }
              else if(lines && type =='linesymbolizer') {
                  lines.setStyle(this.createLineStyleFunction());
                  lines.setVisible(true);
                  if(polygons) polygons.setVisible(false);
                  if(points) points.setVisible(false);
              }
              else if(points && type =='pointsymbolizer') {
                  points.setStyle(this.createPointStyleFunction());
                  points.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(polygons) polygons.setVisible(false);
              }
              else if( type =='textsymbolizer') {
                  points.setStyle(this.createTextStyleFunction());
                  points.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(polygons) polygons.setVisible(false);
              }

          }


      },
      // Style for points
      getPointStyle : function() {
          var stroke,
              fill,
              style;
          if(this.getStrokeColor() && this.getFillColor()) {
          style = new ol.style.Style({
               image: new ol.style.Circle({
                  radius: this.getSize(),
                  fill: new ol.style.Fill({color: this.getFillColor()}),
                  stroke: new ol.style.Stroke({color: this.getStrokeColor(), width: this.getStrokeWidth()})
              })
          });

          }
          else if(this.getStrokeColor()) {
              style = new ol.style.Style({
                  image: new ol.style.Circle({
                      radius: this.getSize(),
                      stroke: new ol.style.Stroke({color: this.getStrokeColor(), width: this.getStrokeWidth()})
                  })
              });

          }
          else if(this.getFillColor()) {
              style = new ol.style.Style({
                  image: new ol.style.Circle({
                      radius: this.getSize(),
                      fill: new ol.style.Fill({color: this.getFillColor()})
                  })
              });

          }
          else {
              style = new ol.style.Style({
                  image: new ol.style.Circle({
                      radius: 6,
                      fill: new ol.style.Fill({color: '#F5F1F1'}),
                      stroke: new ol.style.Stroke({color: 'red', width: 1})
                  })
              });
          }
          return style;
      },
      // Style for polygons and lines
      getPolygonOrLineStyle : function() {
          var stroke,
          fill,
          style;
          if(this.getStrokeColor() && this.getFillColor() ) {
              stroke = new ol.style.Stroke({
                  color: this.getStrokeColor(),
                  width: this.getStrokeWidth()
              });

              fill = new ol.style.Fill({
                  color: this.getFillColor()

              });
                  style = new ol.style.Style({
                      stroke: stroke,
                      fill: fill
                  });
              }
          else  if(this.getFillColor() && !this.getStrokeColor()  ) {
              fill = new ol.style.Fill({
                  color: this.getFillColor()

              });
                  style = new ol.style.Style({
                      fill: fill
                  });

          }
          else  if(!this.getFillColor() && this.getStrokeColor()  ) {
              stroke = new ol.style.Stroke({
                  color: this.getStrokeColor(),
                  width: this.getStrokeWidth()
              });
              style = new ol.style.Style({
                  stroke: stroke
              });

          }
          else {
              style = new ol.style.Style({
                  stroke: new ol.style.Stroke({
                      color: 'red',
                      width: 1
                  })
              });
          }

          return style;

      },
      // Polygons
      createPolygonStyleFunction : function() {
          var style = this.getPolygonOrLineStyle();

          return function(feature, resolution) {
              return [style];
          };
      },
      // Lines
      createLineStyleFunction : function() {
          var style = this.getPolygonOrLineStyle();

          return function(feature, resolution) {
              return [style];
          };
      },
      // Points
      createPointStyleFunction : function() {
          var self = this;
          return function(feature, resolution) {
              var style = self.getPointStyle();
              return [style];
          };
      },
      // Points with name labels
      createTextStyleFunction : function() {
          var self = this;
          return function(feature, resolution) {
              var style = new ol.style.Style({
                  image: new ol.style.Circle({
                      radius: 10,
                      fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.1)'}),
                      stroke: new ol.style.Stroke({color: 'red', width: 1})
                  }),
                  text: self.createTextStyle(feature, resolution, self.params)
              });
              return [style];
          };
      },
      getStrokeColor : function() {
          var self = this,
              color;
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'stroke') color = param['default_value'];
              });
          }
          return color;
      },
      getFillColor : function() {
          var self = this,
              color;  //'#F5F1F1'
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'fill') color = param['default_value'];
              });
          }
          return color;
      },
      getStrokeWidth : function() {
          var self = this;
          var width = 1;
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'stroke-width') width = param['default_value'];
              });
          }
          if(width > 6 ) width = 6;
          return width;
      },
      getSize : function() {
          var self = this;
          var size = 8;
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'size') size = param['default_value'];
              });
          }
          if(size > 20) size = 20;
          return size;
      },
      getWellKnownName : function() {
          var self = this;
          var name = 'circle';
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'wellknownname') name = param['default_value'];
              });
          }
          return name;
      },
    createTextStyle : function(feature, resolution, params) {
          var align = 'Center';
          var baseline = 'Middle';
          var size = '12px';
          var offsetX = 10;
          var offsetY = 10;
          var weight = 'Normal';
          var rotation = 0.0;
          var font = weight + ' ' + size + ' ' + 'Arial';
          var fillColor = '#000000';
          var outlineColor = 'black';
          var outlineWidth =  0;
          var text = feature.get('name');
          return new ol.style.Text({
              textAlign: align,
              textBaseline: baseline,
              font: font,
              text: text,
              fill: new ol.style.Fill({color: fillColor}),
              stroke: new ol.style.Stroke({color: outlineColor, width: outlineWidth}),
              offsetX: offsetX,
              offsetY: offsetY,
              rotation: rotation
          });
      },
    render: function() {
      // create a map in the "map" div, set the view to a given place and zoom
        var self = this;
      if (!this.map) {

          console.log('setParams2MapStyle --Map');
          var vectorPolygons = new ol.layer.Vector({
              source: new ol.source.GeoJSON({
                  projection: 'EPSG:3857',
                  url: 'data/geojson/polygon-samples.geojson'
              }),
              title: 'Polygons',
              style: self.createPolygonStyleFunction()
          });




          var vectorLines = new ol.layer.Vector({
              source: new ol.source.GeoJSON({
                  projection: 'EPSG:3857',
                  url: 'data/geojson/line-samples.geojson'
              }),
              title: 'Lines',
              style: self.createLineStyleFunction()
          });

          var vectorPoints = new ol.layer.Vector({
              source: new ol.source.GeoJSON({
                  projection: 'EPSG:3857',
                  url: 'data/geojson/point-samples.geojson'
              }),
              title: 'Points',
              style: self.createPointStyleFunction()
          });
          // mouse position in 3857
          var llMouse = new ol.control.MousePosition({
              // format coords as "HDMS (x,y)"
              coordinateFormat: function(coordinate) {
                  return ol.coordinate.toStringHDMS(coordinate) + ' (' +
                      ol.coordinate.toStringXY(coordinate, 4) + ')'; // 4 decimal places
              },
              projection: 'EPSG:3857' // by default, uses view projection
          });
          this.map = new ol.Map({
              controls: ol.control.defaults().extend([llMouse]),
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
          this.map.addInteraction(new ol.interaction.Select({
              condition: ol.events.condition.mouseMove
          }));

      } else {
        // map node has been detached.
        // Note! event handling might not function properly, but since we currently do not have any map specific
        // event handling, this is not tested. Look at assign in SLDEditorPage for more details.
        this.$el.replaceWith(this.map.getTarget());
        // reset map view
        this.map.getView().setCenter([2776000, 8444000], 13);
      }
    }
  });
  return SLDMapView;
});