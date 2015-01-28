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
        'change .param': 'setParam',
    },
    initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.updateEditParams);
      this.listenTo(this.dispatcher, "backToList", this.back);
      this.listenTo(this.dispatcher, "configSaved", this.showInfoModal);
      this.listenTo(this.dispatcher, "logout", this.logoutFromEditor);
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
    render: function(paramlist,symbol,ruletitle) {
        var localization = locale;
        var model = this.SLDconfigmodel.pick('id', 'name');
        var params = _.isUndefined(paramlist) ? false : paramlist;
        var uom = _.isUndefined(symbol) ? false : symbol.uom;
        var type = _.isUndefined(symbol) ? "none" : symbol.type.toLowerCase();
        var data;
        var typeKey;
        var attrKey;
        var i;
        // Generate attribute data
        this.initAttrData();
        data = this.attrData;

        this.symbolType = type;

        // Visit all types
        if (type) {
            for (typeKey in data) {
                if (data.hasOwnProperty(typeKey)) {
                    // Visit all supported type attributes
                    for (attrKey in data[typeKey].values) {
                        if (data[typeKey].values.hasOwnProperty(attrKey)) {
                            for (i = 0; i < params.length; i++) {
                                data[typeKey].values[attrKey].class = "hidden";
                                if (attrKey === params[i].attributeName) {
                                    data[typeKey].class = "";
                                    data[typeKey].values[attrKey].param_id = params[i].param_id;
                                    data[typeKey].values[attrKey].value = params[i].value;
                                    data[typeKey].values[attrKey].name = params[i].attributeName;
                                    data[typeKey].values[attrKey].class = "";
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        // Handle external graphic
        if (typeof data.graphic.values["external-graphic"].value !== "undefined"){
            data.graphic.values["external-graphic"].class = ""; // Not hidden
            data.graphic.values["wellknownname"] = "external";  // Drop-down value
        }
        this.$el.html(this.template({SLDmodel: model, editSLD: localization, attrData: data, symbolType: type, symbolUnit: uom, ruletitle: ruletitle}));
        if (paramlist) {
          this.renderPreview(paramlist, type);
          $(this.el).find(".symbolizer-chosen").removeClass("hidden");
          $(this.el).find(".preview-frame").removeClass("hidden");
          $(this.el).find(".info-text").addClass("hidden");
        }
        return this;
    },
    /**
     * @method updateEditParams
     * Updates SLDeditor view with editable params
     */
    updateEditParams: function(params,symbolizer,ruletitle) {
      console.log('updateEditParams', params);
      var self = this,
          paramlist = this.SLDconfigmodel.getSLDValuesByParams(params),
          symbol = {
            type: symbolizer.type,
            uom: symbolizer.uom
          };

      if (self.configSaved === false) {
        $('#confirmNoSave').modal('show');
        $('#continueButton').on("click", function () {
          $('#confirmNoSave').modal('hide');
          self.configSaved = true;
          self.render(paramlist,symbol,ruletitle);
        });
      } else {
        self.render(paramlist,symbol,ruletitle);
      }
    },

    back: function () {
      var self = this;

      if (self.configSaved === false) {
        $('#confirmNoSave').modal('show');
        $('#continueButton').on("click", function () {
          $('#confirmNoSave').modal('hide');
          self.configSaved = true;
          Backbone.history.navigate('/', true);
        });
      } else {
        Backbone.history.navigate('/', true);
      }
    },

    setAttribute: function(event) {
      var element = $(event.currentTarget);
      var attribute = "" + element.data('attribute');
      var newvalue = element.val();

      this.SLDconfigmodel.set(attribute, newvalue);
    },
    setParam: function(event) {
      var element,
          newvalue, 
          param_id, 
          param_css_parameter;

      // if shape is changed
//      if (event.currentTarget.innerText === "Symbol") {
      var param_id = null;
      var param_css_parameter = null;

      if (event.target.id === "graphic-symbol") {
        element = $(event.target)[0];//.find("#graphic-symbol");
        newvalue = element.value.toLowerCase();
        // Update map style
        this.renderWellKnownName(newvalue);
        param_id = "" + element.dataset['paramId'];
        this.dispatcher.trigger("updateMapStyle",[{'name':'wellknownname','value': newvalue}],this.symbolType );
      } else {
        element = $(event.currentTarget).find(".form-control")[0];
        param_id = "" + element.dataset['paramId'];
        param_css_parameter = element.dataset['cssParameter'];
        newvalue = element.value;
        if (param_css_parameter === "rotation") {
          this.elementRotation = newvalue;
          this.previewElement.transform({rotation: this.elementRotation});
        // we don't want preview to update size
        } else if (param_css_parameter === "size") {
          this.elementSize = parseInt(newvalue);
        // we don't want preview to update stroke-width
        } else if (param_css_parameter === "stroke-width") {
          //in case we need this later
          this.strokeWidth = parseInt(newvalue);
        } else if (param_css_parameter === "font-size") {
          //in case we need this later
          this.textSize = parseInt(newvalue);
        } else if (param_css_parameter === "stroke-dasharray-part") {
          newvalue = jQuery('input#stroke-dasharray-length').val()+' '+jQuery('input#stroke-dasharray-space').val();
          this.attributes["stroke-dasharray"] = newvalue;
          this.updatePreview();
        } else {
          this.attributes[param_css_parameter] = newvalue;
          this.updatePreview();
        }
          // Update map style
          this.dispatcher.trigger("updateMapStyle",[{'name':param_css_parameter,'value': newvalue}], this.symbolType );
      }


      //Update the model. But now there's a problem with reset
      if (param_id) {
        var sld_param = _.findWhere(this.SLDconfigmodel.attributes.sld_values, {param_id: param_id});

        if (sld_param) {
          sld_param.value = newvalue;
        }
      }
      var sld_values = this.SLDconfigmodel.get('sld_values');
      this.SLDconfigmodel.set('sld_values', sld_values);
      //this.configSaved tells if there are unsaved changes
      this.configSaved = false;
      $(this.el).find(".cancel-changes").removeClass("disabled");

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
                class: "hidden",
                values: {
                    "size": {class: ""},
                    "opacity": {class: ""},
                    "rotation": {class: ""},
                    "onlineresource": {class: ""},
                    "wellknownname": {class: ""},
                    "fill": {class: ""},
                    "fill-opacity": {class: ""},
                    "external-graphic": {class: "hidden"}
                }
            },
            line: {
                pointsymbolizer: "",
                linesymbolizer: "",
                polygonsymbolizer: "",
                textsymbolizer: "hidden",
                none: "hidden",
                class: "hidden",
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
                class: "hidden",
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
                class: "hidden",
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
      var self = this;
      event.preventDefault();
      self.SLDconfigmodel.save({},{
        success: function (model, response) {
          self.configSaved = true;
          self.dispatcher.trigger("configSaved");
        },
        error: function (model, response, options) {
          alert('something went wrong!');
          console.log('Error', model, response, options);
        },
        wait: true
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

    showInfoModal: function () {
      console.log("infomodal should be shown");
      //$('#informUserModal').modal();
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
      } else if (symbolType === "textsymbolizer") {
        this.renderText(params);
      } else {
        console.log("geometryType of params is not defined");
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
          var attribute = params[i].attributeName;
          var attributeValue = params[i].value;
          this.attributes[attribute] = attributeValue;
        }
      }
      this.elementSize = 20;
      this.elementRotation = 0;
      if (_.has(this.attributes, "stroke")) {
        this.attributes["stroke-width"] = 3;
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
        this.previewElement = this.preview.circle(50);
      } else {
        var path = this.graphicPaths[wellknownname];
        this.previewElement = this.preview.path(path);
        this.previewElement.size(50);
      }
      this.previewElement.attr(this.attributes);
      this.previewElement.transform({rotation: this.elementRotation});
      this.previewElement.center(80,75);
    },

    renderExternalGraphics: function () {
      console.log('External graphics are not yet supported');
      //this.previewElement = this.preview.image(this.xlink, this.elementSize);
      //this.previewElement.center(75, 75);
      //this.previewElement.transform({rotation: this.elementRotation});
    },

    renderLine: function (params) {
      this.preview.clear();
      for (var i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        if (attribute !== "stroke-width") {
          this.attributes[attribute] = attributeValue;
        }
      }
      this.previewElement = this.preview.line(20, 20, 130, 130).stroke({width: 8});
      this.previewElement.attr(this.attributes);
    },

    renderPolygon: function (params) {
      this.preview.clear();
      var strokeWidth = false;
      for (var i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        if (attribute === "stroke-width") {
          strokeWidth = true
        } else {
          this.attributes[attribute] = attributeValue;
        }
      }
      this.previewElement = this.preview.polygon('20,50 100,40 80,130 20,100').fill('none');
      this.previewElement.attr(this.attributes);
      if (strokeWidth === true) {
        this.previewElement.attr({"stroke-width": 4});
      }
    },

    renderText: function (params) {
      this.preview.clear();
      for (i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        if (attribute === "font-family" || attribute === "font-style" || attribute === "font-weight" || attribute === "fill" || attribute === "halo-color" || attribute === "halo-radius") {
          this.attributes[attribute] = attributeValue;
        }
      }
      this.previewElement = this.preview.text("Text!").font({size: 30});
      this.previewElement.attr(this.attributes);
      this.previewElement.center(40,40);
    },

    updatePreview: function () {
      if (_.has(this.attributes, "stroke") && (this.symbolType === "pointsymbolizer" || this.symbolType === "polygonsymbolizer")) {
        this.attributes["stroke-width"] = 3;
      }
      this.previewElement.attr(this.attributes);
    },

    logoutFromEditor: function () {
      var self = this;
      debugger;

      if (self.configSaved === false) {
        $('#confirmNoSave').modal('show');
        $('#continueButton').on("click", function () {
          $('#confirmNoSave').modal('hide');
          self.configSaved = true;
          //go to logout window
        });
      } else {
        //go to logout window
      }
    }

  });
  return SLDEditorView;
});