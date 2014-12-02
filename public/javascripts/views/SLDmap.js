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
        this.listenTo(this.dispatcher, "updateMapStyle", this.updateMapStyle);
        this.listenTo(this.dispatcher, "all", this.logger);
      _.bindAll(this, 'render');
    },
      /**
       * @method updateMapStyle
       * update map style for one symbolizer for visible layer
       */
      updateMapStyle: function(params) {
          console.log('updateMapStyle', params);
          var polygons, points, lines, style;
          this.params = params;
          this.map.getLayers().forEach(function (l)
          {
              if (l.get('title') == 'Polygons'  && l.getVisible()) polygons = l;
              if (l.get('title') == 'Lines' && l.getVisible()) lines = l;
              if (l.get('title') == 'Points' && l.getVisible()) points = l;
          });
          if(polygons){
              style = polygons.getStyle();
              polygons.setStyle(this.getPolygonOrLineStyle(style));
          }
          else if(lines){
              style = lines.getStyle();
              lines.setStyle(this.getPolygonOrLineStyle(style));
          }
          else if(points){
              style = points.getStyle();
              points.setStyle(this.getPointStyle(style));
          }
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
                  polygons.setStyle(this.getPolygonOrLineStyle());
                  polygons.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(points) points.setVisible(false);
              }
              else if(lines && type =='linesymbolizer') {
                  lines.setStyle(this.getPolygonOrLineStyle());
                  lines.setVisible(true);
                  if(polygons) polygons.setVisible(false);
                  if(points) points.setVisible(false);
              }
              else if(points && type =='pointsymbolizer') {
                  points.setStyle(this.getPointStyle());
                  points.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(polygons) polygons.setVisible(false);
              }
              else if( type =='textsymbolizer') {
                  points.setStyle(this.getPointTextStyle());
                  points.setVisible(true);
                  if(lines) lines.setVisible(false);
                  if(polygons) polygons.setVisible(false);
              }

          }


      },
      // Style for points
      getPointStyle : function(stylein) {
          var fill = this.getFill(stylein),
              style;
        if(fill) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: this.getSize(stylein),
                    fill: fill,
                    stroke: new ol.style.Stroke({color: this.getStrokeColor(stylein), width: this.getStrokeWidth(stylein)})
                })
            });
        }
        else {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: this.getSize(stylein),
                    stroke: new ol.style.Stroke({color: this.getStrokeColor(stylein), width: this.getStrokeWidth(stylein)})
                })
            });
        }

          return style;
      },
      // Style for point labels
      getPointTextStyle : function() {

          style = new ol.style.Style({
              image: new ol.style.Circle({
                  radius: this.getSize(),
                  fill: new ol.style.Fill({color: this.getFillColor()}),
                  stroke: new ol.style.Stroke({color: this.getStrokeColor(), width: this.getStrokeWidth()})
              }),
              text: this.getTextStyle()
          });

          return style;
      },
      // Style for polygons and lines
      getPolygonOrLineStyle : function(stylein) {
          var stroke,
          fill,
          style;

              stroke = new ol.style.Stroke({
                  color: this.getStrokeColor(stylein),
                  width: this.getStrokeWidth(stylein)
              });

              fill = this.getFill(stylein);

          if(fill) {
              style = new ol.style.Style({
                  stroke: stroke,
                  fill: fill
              });
          }
          else {
              style = new ol.style.Style({
                  stroke: stroke
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
          var style = this.getPointStyle();
          return function(feature, resolution) {
              return [style];
          };
      },
      // Points with name labels
      createTextStyleFunction : function() {
          var self = this;
          return function(feature, resolution) {
              var style = new ol.style.Style({
                  image: new ol.style.Circle({
                      radius: this.getSize(),
                      fill: new ol.style.Fill({color: this.getFillColor()}),
                      stroke: new ol.style.Stroke({color: this.getStrokeColor(), width: this.getStrokeWidth()})
                  }),
                  text: self.getTextStyle()
              });
              return [style];
          };
      },
      getStrokeColor : function(style) {
          var self = this,
              color = 'rgba(255,255,255,0.0)';
          if(style) {
              if (style.getStroke()) color = style.getStroke().getColor();
          }
          if (self.params) {
                  self.params.forEach(function (param) {
                      if (param['name'] === 'stroke') color = !style ?  param['default_value'] : param['value'] ;
                  });
          }
          return color;
      },
      getFillColor : function(style) {
          var self = this,
              color = 'rgba(255,255,255,0.0)';
          if(style) {
              if (style.getFill()) color = style.getFill().getColor();
          }
          if (self.params) {
                  self.params.forEach(function (param) {
                      if (param['name'] === 'fill') color = !style ?  param['default_value'] : param['value'] ;
                  });
          }
          return color;
      },
      getFill : function(style) {
          var self = this,
              fill,
              color;

          if(style) {
              if (style.getFill()){
                  color = style.getFill().getColor();
              }
          }
          if (self.params) {
              self.params.forEach(function (param) {
              if (param['name'] === 'fill') color = !style ?  param['default_value'] : param['value'] ;
              });
          }
          if (color) fill =  new ol.style.Fill({color: color});

          return fill;
      },
      getStrokeWidth : function(style) {
          var self = this;
          var width = 1;
          if(style) {
              if (style.getStroke()){
                  width = style.getStroke().getWidth();
              }
          }
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'stroke-width') width = !style ?  param['default_value'] : param['value'] ;
              });
          }
          if(width > 6 ) width = 6;
          return Number(width);
      },
      getSize: function (style) {
          // Need special handling - depends on which kind of image is on
          // Circle size is radius, but its image soze is width height Array[2]
          var self = this;
          var size = 6;
          if (style) {
              if (style.getImage()) {
                  size = style.getImage().getRadius();
                  if (!size) size = style.getImage().getHeight()[1];
              }
          }
          if (self.params) {
              self.params.forEach(function (param) {
                  if (param['name'] === 'size') size = !style ? param['default_value'] : param['value'];
              });
          }
          if (size > 20) size = 20;
          return Number(size);
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
      getTextStyle : function() {
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
          var text = 'Label text';
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
        /*  this.map.addInteraction(new ol.interaction.Select({
              condition: ol.events.condition.mouseMove
          }));  */


      } else {
        // map node has been detached.
        // Note! event handling might not function properly, but since we currently do not have any map specific
        // event handling, this is not tested. Look at assign in SLDEditorPage for more details.
        this.$el.replaceWith(this.map.getViewport());
        // reset map view
        this.map.getView().setCenter([2776000, 8444000], 13);
      }
    }
  });
  return SLDMapView;
});