define([
	'lodash',
	'backbone',
	'jquery',
	'bootstrap',
  'svg',
	'i18n!localization/nls/SLDeditor',
	'text!templates/SLDeditor.html'
], function(_, Backbone, $, Bootstrap, SVG, locale, editSLDTemplate) {
	var SLDEditorView = Backbone.View.extend({
    className: 'page',
		template: _.template(editSLDTemplate),
        // Configuration:
        attrData: {},
		events: {
	      'click .delete': 'deleteConfig',
	      'click .upload': 'showUpload',
          'click .save': 'saveConfig',
          'change .name': 'setAttribute',
          'change .param': 'setParam'
    },
		initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.updateEditParams);
      this.listenTo(this.dispatcher, "all", this.logger);
      this.setModel(params.SLDconfigmodel);
      _.bindAll(this, 'render');
    },
    logger: function() {
      console.log('listening to all events in SLDeditor model', arguments);
    },
    setModel: function(model) {
      var self = this;

      // we must stop listening first and then add to current model
      self.stopListening(self.SLDconfigmodel, "invalid");
      self.stopListening(self.SLDconfigmodel, "all");
      self.stopListening(self.SLDconfigmodel, "sync");
      self.SLDconfigmodel = model;
      self.listenTo(self.SLDconfigmodel, "invalid", self.invalidValue);
      self.listenTo(self.SLDconfigmodel, "all", self.logger);
      self.listenTo(self.SLDconfigmodel, "sync", function () { self.render();});
    },
    render: function(paramlist,symbolType) {
        var localization = locale;
        var model = this.SLDconfigmodel.pick('id', 'name');
        var params = _.isUndefined(paramlist) ? false : paramlist;
        var type = _.isUndefined(symbolType) ? "none" : symbolType;
        var data;
        var typeKey;
        var attrKey;
        var i;
        // Generate attribute data
        this.initAttrData();
        data = this.attrData;

        // Visit all types
        if (type) {
            for (typeKey in data) {
                if (data.hasOwnProperty(typeKey)) {
                    // Visit all supported type attributes
                    for (attrKey in data[typeKey].values) {
                        if (data[typeKey].values.hasOwnProperty(attrKey)) {
                            for (i = 0; i < params.length; i++) {
                                if (attrKey === params[i].attributeName) {
                                    data[typeKey].values[attrKey].param_id = params[i].param_id;
                                    data[typeKey].values[attrKey].value = params[i].value;
                                    data[typeKey].values[attrKey].class = "";
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.$el.html(this.template({SLDmodel: model, editSLD: localization, attrData: data, symbolType: type}));
        if (paramlist) {
          this.renderPreview(paramlist, symbolType);
        }
        return this;
    },

    /**
     * @method updateEditParams
     * Updates SLDeditor view with editable params
     */
    updateEditParams: function(params,type) {
      console.log('updateEditParams', params);
      var paramlist = this.SLDconfigmodel.getSLDValuesByParams(params);
      this.render(paramlist,type);
    },

    setAttribute: function(event) {
      var element = $(event.currentTarget);
      var attribute = "" + element.data('attribute');
      var newvalue = element.val();

      this.SLDconfigmodel.set(attribute, newvalue);
    },
    setParam: function(event) {
      // if shape is changed
      var element,
          newvalue;
      if (event.currentTarget.innerText === "Symbol") {
        element = $(event.currentTarget).find("#graphic-symbol");
        newvalue = element[0].value.toLowerCase();
        this.renderWellKnownName(newvalue)
      } else {
        element = $(event.currentTarget).find(".symbolizer-attribute-value");
        var param_id = "" + element.data('param-id');
        var param_css_parameter = element[0].id;
        newvalue = element.val();
        if (param_css_parameter === "rotation") {
          this.elementRotation = newvalue;
          this.previewElement.transform({rotation: this.elementRotation});
        } else if (param_css_parameter === "size") {
          this.elementSize = parseInt(newvalue);
          this.previewElement.size(this.elementSize);
        } else {
          this.attributes[param_css_parameter] = newvalue;
          this.updatePreview();
        }
      }
      var sld_values = this.SLDconfigmodel.get('sld_values');
      // we assume the changed param_id is always found
      var paramIndex = _.findIndex(sld_values, {'param_id': param_id});
      var param = sld_values[paramIndex];
      param.value = newvalue;

      this.SLDconfigmodel.set('sld_values', sld_values);
    },

    invalidValue: function(event) {
      console.log('got invalid', event, arguments);
    },

    initAttrData: function () {
        this.attrData = {
            graphic: {
                pointsymbolizer: "",
                linesymbolizer: "hidden",
                polygonsymbolizer: "hidden",
                textsymbolizer: "hidden",
                none: "hidden",
                values: {
                    "size": {class: ""},
                    "opacity": {class: ""},
                    "rotation": {class: ""},
                    "onlineresource": {class: ""},
                    "wellknownname": {class: ""},
                    "mark-fill": {class: ""},
                    "mark-fill-opacity": {class: ""}
                }
            },
            line: {
                pointsymbolizer: "hidden",
                linesymbolizer: "",
                polygonsymbolizer: "",
                textsymbolizer: "hidden",
                none: "hidden",
                values: {
                    "stroke": {class: ""},
                    "stroke-opacity": {class: ""},
                    "stroke-width": {class: ""},
                    "stroke-linejoin": {class: ""},
                    "stroke-linecap": {class: ""},
                    "stroke-dasharray": {class: ""},
                    "stroke-dashoffset": {class: ""}
                }
            },
            polygon: {
                pointsymbolizer: "hidden",
                linesymbolizer: "hidden",
                polygonsymbolizer: "",
                textsymbolizer: "hidden",
                none: "hidden",
                values: {
                    "fill": {class: ""},
                    "fill-opacity": {class: ""}
                }
            },
            text: {
                pointsymbolizer: "hidden",
                linesymbolizer: "hidden",
                polygonsymbolizer: "hidden",
                textsymbolizer: "",
                none: "hidden",
                values: {
                    "label": {class: ""},
                    "font-family": {class: ""},
                    "font-style": {class: ""},
                    "font-weight": {class: ""},
                    "font-size": {class: ""},
                    "pointplacement-anchorpointx": {class: ""},
                    "pointplacement-anchorpointy": {class: ""},
                    "pointplacement-displacementx": {class: ""},
                    "pointplacement-displacementy": {class: ""},
                    "pointplacement-rotation": {class: ""},
                    "lineplacement-perpendicularoffset": {class: ""},
                    "text-fill": {},
                    "text-fill-opacity": {},
                    "halo-color": {class: ""},
                    "halo-radius": {class: ""}
                }
            }
        }
    },

    saveConfig: function(event) {
      event.preventDefault();
      this.SLDconfigmodel.save({},{
        wait: true,
        error: function (model, response, options) {
          alert('something went wrong!');
          console.log('Error', model, response, options);
        }
      });
    },

    deleteConfig: function () {
      event.preventDefault();
      this.SLDconfigmodel.destroy({
        wait: true,
        success: function (model, response, options) {
          Backbone.history.navigate('', true);
        }, error: function (model, response, options) {
          console.log("something didn't go as planned", model, response, options);
          alert('Deleting template is not possible1234');
        }
      });
    },

    renderPreview: function (params, symbolType) {
      this.attributes = {};
      this.preview = SVG('preview');
      if (symbolType === "pointsymbolizer") {
        this.renderPoint(params);
      } else if (symbolType === "linesymbolizer") {
        this.renderLine(params);
      } else if (symbolType === "polygonsymbolizer") {
        this.renderPolygon(params);
      } else {
        alert("geometryType of params is not defined");
      }
    },

    renderPoint: function (params) {
      // graphic paths are from this website: http://raphaeljs.com/icons/
      this.graphicPaths = {
        "triangle": "M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z",
        "star": "M16,22.375L7.116,28.83l3.396-10.438l-8.883-6.458l10.979,0.002L16.002,1.5l3.391,10.434h10.981l-8.886,6.457l3.396,10.439L16,22.375L16,22.375z",
        "cross": "M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z",
        "x": "M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z",
        "square": "M5.5,5.5h20v20h-20z"
      };

      //parse attributes and check if the element is Mark or ExternalGraphic
      var hasWellKnownName = false;
      for (var i=0; i < params.length; i++) {
        if (params[i].attributeName === "wellknownname") {
          hasWellKnownName = true;
          var wellknownname = params[i].value
        } else if (params[i].attributeName === "size") {
          this.elementSize = params[i].value;
        } else if (params[i].attributeName === "rotation") {
          this.elementRotation = params[i].value;
        } else {
          this.elementSize = 20;
          this.elementRotation = 0;
          var attribute = params[i].attributeName;
          var attributeValue = params[i].value;
          this.attributes[attribute] = attributeValue;
        }
      }

      //create preview element
      if (hasWellKnownName === true) {
        this.renderWellKnownName(wellknownname);
      } else {
        this.renderExternalGraphics();
      }
    },

    renderWellKnownName: function(wellknownname) {
      this.preview.clear();
      if (!_.has(this.graphicPaths, wellknownname)) {
        this.previewElement = this.preview.circle(this.elementSize);
      } else {
        var path = this.graphicPaths[wellknownname];
        this.previewElement = this.preview.path(path);
      }
      this.previewElement.attr(this.attributes);
      this.previewElement.size(this.elementSize);
      this.previewElement.center(75, 75);
      this.previewElement.transform({rotation: this.elementRotation});
    },

    renderExternalGraphics: function () {
      console.log('External graphics are not yet supported');
      //this.previewElement = this.preview.image(this.xlink, this.elementSize);
      //this.previewElement.center(75, 75);
      //this.previewElement.transform({rotation: this.elementRotation});
    },

    renderLine: function (params) {
      this.preview.clear();
      for (i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        this.attributes[attribute] = attributeValue;
      }
      this.previewElement = this.preview.line(20, 20, 130, 130).stroke({width: 1});
      this.previewElement.attr(this.attributes);
    },

    renderPolygon: function (params) {
      this.preview.clear();
      for (i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        this.attributes[attribute] = attributeValue;
      }
      this.previewElement = this.preview.polygon('20,50 100,40 80,130 20,100').fill('none');
      this.previewElement.attr(this.attributes);
    },

    updatePreview: function () {
      this.previewElement.attr(this.attributes);
    }
	});

	return SLDEditorView;
});