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
        var key;
        var i;
        // Generate attribute data
        this.initAttrData();
        var data = this.attrData;
        for (key in data.graphic.values) {
            if (!type) {
                break; // return in the future
            }
            if (data.graphic.values.hasOwnProperty(key)) {
                for (i=0; i<params.length; i++) {
                    if ((key === params[i].name)||(key+"/Literal" === params[i].name)) {
                        data.graphic.values[key].param_id = params[i].param_id;
                        data.graphic.values[key].value = params[i].value;
                        data.graphic.values[key].class = "";
                        break;
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
      var element = $(event.currentTarget).find("input.symbolizer-attribute-value");
      var param_id = "" + element.data('param-id');
      var newvalue = element.val();

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
                linesymbolizer: "",
                polygonsymbolizer: "hidden",
                none: "hidden",
                values: {
                    "Graphic/ExternalGraphic/OnlineResource": { class: "" },
                    "Graphic/ExternalGraphic/Format": { class: "" },
                    "Graphic/Size": { class: "" },
                    //"Graphic/Opacity": { class: "" },
                    "Graphic/Rotation": { class: "" },

                    "Graphic/Mark/WellKnownName": { class: "" },
                    "Graphic/Mark/Fill/CssParameter(fill)": { class: "" },
                    "Graphic/Mark/Fill/CssParameter(fill-opacity)": { class: "" },

                    "Graphic/Mark/Stroke/CssParameter(stroke)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-opacity)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-width)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-linejoin)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-linecap)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-dasharray)": { class: "" },
                    "Graphic/Mark/Stroke/CssParameter(stroke-dashoffset)": { class: "" }
                }
            },
            line: {
                pointsymbolizer: "hidden",
                linesymbolizer: "",
                polygonsymbolizer: "hidden",
                none: "hidden",
                values: {
                    "Stroke/CssParameter(stroke)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-opacity)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-width)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-linejoin)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-linecap)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-dasharray)": {class: "hidden"},
                    "Stroke/CssParameter(stroke-dashoffset)": {class: "hidden"}
                }
            },
            polygon: {
                pointsymbolizer: "hidden",
                linesymbolizer: "",
                polygonsymbolizer: "",
                none: "hidden"
            },
            text: {
                pointsymbolizer: "hidden",
                linesymbolizer: "hidden",
                polygonsymbolizer: "hidden",
                none: "hidden"
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
          alert('Deleting template is not possible');
        }
      });
    },

    renderPreview: function (params, symbolType) {
      this.preview = SVG('preview').size(100,100);
      //var element = preview.rect(50, 50).attr({ fill: '#f06' })
      if (symbolType === "pointsymbolizer") {
        this.renderPoint(params);
      } else if (symbolType === "linesymbolizer") {
        this.renderLine(params);
      } else if (symbolType === "polygonsymbolizer") {
        this.renderArea(params);
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
        "rectangle": "M5.5,5.5h20v20h-20z"
      }

      //parse attributes and check if the element is Mark or ExternalGraphic
      var attributes = {};
      var hasWellKnownName = false;
      for (i=0; i < params.length; i++) {
        if (params[i].attributeName === "wellknownname") {
          hasWellKnownName = true;
          var wellknownname = params[i].value
        } else {
          var attribute = params[i].attributeName;
          var attributeValue = params[i].value;
          attributes[attribute] = attributeValue;
        }
      }

      //create preview element
      if (hasWellKnownName === true) {
        if (!_.has(this.graphicPaths, wellknownname)) {
          var element = this.preview.circle(50,50,10);
          element.attr(attributes);
        } else {
          var path = this.graphicPaths[wellknownname];
          var element = this.preview.path(path);
          element.attr(attributes);
        }
      } else {
        console.log("external graphics are not yet supported");
      }
    },

    renderLine: function (params) {
      console.log("rendering line is not yet supported");
    },

    renderArea: function (params) {
      console.log("rendering area is not yet supported");
    }
	});

	return SLDEditorView;
});