define([
  'lodash',
  'backbone',
  'jquery',
  'bootstrap',
  'svg',
  'i18n!localization/nls/SLDeditor',
  'validation/validate',
  'text!templates/SLDeditor.html'
], function(_, Backbone, $, Bootstrap, SVG, locale, validateFunctions, editSLDTemplate) {
  var SLDEditorView = Backbone.View.extend({
    className: 'page',
    template: _.template(editSLDTemplate),
    // Configuration:
    attrData: {},
    events: {
        'click .delete': 'deleteConfig',
        'click .upload': 'showUpload',
        'change .name': 'setAttribute',
        'keyup .param': 'setParam',
        'change .param': 'setParam',
        'click .cancel-changes':'resetModel',
        'keyup .rule-input':'updateRule'
    },

    initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.symbolizerChanged);
      this.listenTo(this.dispatcher, "backToList", this.back);
      this.listenTo(this.dispatcher, "saveConfig", this.saveConfig);
      this.listenTo(this.dispatcher, "configSaved", this.showInfoModal);
      this.listenTo(this.dispatcher, "resetModel", this.resetModel);
      this.listenTo(this.dispatcher, "wmsPreview", this.wmsPreview);
      this.listenTo(this.dispatcher, "logout", this.logoutFromEditor);
      this.listenTo(this.dispatcher, "all", this.logger);
      this.setModel(params.SLDconfigmodel);
      this.originalValuesStored = false;
      _.bindAll(this, 'render');
    },
    logger: function() {
      console.log('listening to all events in SLDeditor model', arguments);
    },
    setModel: function(model) {
      var self = this;

      // we must stop listening first and then add to current model
      self.stopListening(self.SLDconfigmodel, "validated:invalid");
      self.stopListening(self.SLDconfigmodel, "all");
      self.stopListening(self.SLDconfigmodel, "sync");
      self.SLDconfigmodel = model;
      self.listenTo(self.SLDconfigmodel, "validated:invalid", self.invalidValue);
      self.listenTo(self.SLDconfigmodel, "all", self.logger);
      // we use promises with saving so we don't propably need this
      //self.listenTo(self.SLDconfigmodel, "sync", self.showInfoModal);
    },
    render: function(paramlist,symbol,ruletitle,rule) {
        if (this.originalValuesStored === false) {
          this.originalAttributes = _.cloneDeep(this.SLDconfigmodel.attributes);
          this.originalValuesStored = true;
        }
        var self = this;
        var localization = locale;
        var SLDconfigmodel = this.SLDconfigmodel;
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
        this.$el.html(this.template({SLDmodel: model, editSLD: localization, attrData: data, symbolType: type, symbolUnit: uom, ruletitle: ruletitle, rule: rule}));
        Backbone.Validation.bind(this, {
          model: SLDconfigmodel
        });
        if (paramlist) {
          this.renderPreview(paramlist, type);
          $(this.el).find(".symbolizer-chosen").removeClass("hidden");
          $(this.el).find(".preview-frame").removeClass("hidden");
          $(this.el).find(".info-text").addClass("hidden");
        }
        return this;
    },

    mergeSymbolizerParamDefaultsWithConfigValues: function(defaultParams) {

      var self = this;
      //get the values corresponding to the defaults from the config model
      var configValues = self.SLDconfigmodel.getSLDValuesByParams(defaultParams);
      var mergedParams = [];
      _.each(defaultParams, function(item) {
          //item.default_value = _.where(allValuesInTheConfigModel,{param_id: param_item.id})[0].value;
          var name = item.name;
          var value = _.where(configValues,{param_id: item.id})[0].value;
          mergedParams.push({name: name, value: value})
      });

      return mergedParams
    },

    /**
     *  @method updateMapSymbolizers
     *  Updates the map by all the symbolizers of the rule
     *
     */
    updateMapSymbolizers: function(params, SLDTemplateModel) {
      var self = this;

      //get the rule id based on given params
      var ruleid = SLDTemplateModel.getRuleIdByParams(params);

      //get all symbolizers for the given rule
      //symbolizers _really_ should be per config as well
      var symbolizers_by_rule = SLDTemplateModel.getSymbolizersByRuleId(ruleid);


      //update the map
      _.each(symbolizers_by_rule, function(item) {
        //get the _default_ params for the symbolizer
        var symbolizerDefaultParams = _.cloneDeep(SLDTemplateModel.getParamsBySymbolizerId(item.id));
        
        //merge those with the (possibly changed) values from the config model
        var mergedParams = self.mergeSymbolizerParamDefaultsWithConfigValues(symbolizerDefaultParams);
        self.dispatcher.trigger("updateMapStyle", mergedParams, item.type, item.id);
      });
    },


    /**
     *
     * @method symbolizerChanged
     * updates the map with all the symbolizers of the rule. 
     *
     */
    symbolizerChanged: function(params, symbolizer, ruletitle, SLDTemplateModel) {
      var self = this;

      //preserve the currently active symbolizer -> will be needed when updating params to map...
      this.activeSymbolizer = symbolizer;

      this.SLDTemplateModel = SLDTemplateModel;
      //symbolizerchange -> toggle point, line and polygon layers off by default (they get toggled on as needed when symbolizers of the rule are added)
      self.dispatcher.trigger("resetVectorLayers");
      self.updateEditParams(params, symbolizer, ruletitle);
      self.updateMapSymbolizers(params, SLDTemplateModel);
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

      //Get the rule of the template (symbolizers bound to that one)
      var sldTemplateRule = params && this.SLDTemplateModel ? this.SLDTemplateModel.getRuleById(this.SLDTemplateModel.getRuleIdByParams(params)) : null;
      //get the rule of this instance corresponding to that of the template (things common to all symbolizers within rule - minscaledenominator, maxscaledenominator, in the future possibly also title, abstract etc.)
      var rule =  sldTemplateRule && this.SLDconfigmodel ? this.SLDconfigmodel.getRuleCorrespondingToTemplateRule(sldTemplateRule) : null;
      self.render(paramlist,symbol,ruletitle, rule);
    },

    back: function () {
      var self = this;

      if (self.configSaved === false) {
        $('#confirmNoSave').modal('show');
        $('#continueButton').on("click", function () {
          $('#confirmNoSave').modal('hide');
          self.configSaved = true;
          self.originalValuesStored = false;
          self.SLDconfigmodel.attributes = null;
          self.SLDconfigmodel.attributes = _.clone(self.originalAttributes);
          self.SLDconfigmodel._previousAttributes = null;
          Backbone.history.navigate('/', true);
        });
      } else {
        self.originalValuesStored = false;
        self.SLDconfigmodel.attributes = null;
        self.SLDconfigmodel.attributes = _.clone(self.originalAttributes);
        self.SLDconfigmodel._previousAttributes = null;
        Backbone.history.navigate('/', true);
      }
    },

    setAttribute: function(event) {
      var element = $(event.currentTarget);
      var attribute = "" + element.data('attribute');
      var newvalue = element.val();

      this.SLDconfigmodel.set(attribute, newvalue);
    },

    /**
     * Updates the rules
     */
    updateRule: function() {

      var ruleId = $('input[id=ruleId').val();
      var rule = ruleId && this.SLDconfigmodel ? this.SLDconfigmodel.getRuleById(ruleId) : null;
      var minScaleDenominator = $('input[id=minScaleDenominator]').val() ? $('input[id=minScaleDenominator]').val() : null;
      var maxScaleDenominator = $('input[id=maxScaleDenominator]').val() ? $('input[id=maxScaleDenominator]').val() : null;
      var validation = validateFunctions.validateMinMax(minScaleDenominator, maxScaleDenominator);
      if (validation[0] === "invalid") {
        validateFunctions.handleInvalidParam(validation, $('#minScaleDenominator')[0]);
      } else if (rule) {
        rule.minscaledenominator = minScaleDenominator;
        rule.maxscaledenominator = maxScaleDenominator;
        validateFunctions.handleValidParam($('#minScaleDenominator')[0]);
      }
    },
    //resets the changes made to the _current_ config model. Still have to implement a "reset all"-button + functionality
    resetModel: function(event) {
      var self = this;
      if (self.configSaved === false) {
        $('#confirmResetModel').modal('show');
        $('#continue').on("click", function () {
            $('#confirmResetModel').modal('hide');
            $('#is-config-saved').addClass("hidden");
            self.SLDconfigmodel.attributes = null;
            self.SLDconfigmodel.attributes = _.clone(self.originalAttributes);
            self.SLDconfigmodel._previousAttributes = null;
            self.dispatcher.trigger("resetVectorLayers");
            self.render();
        });
      }
    },

    setParam: function(event) {
      var element,
          newvalue, 
          param_id, 
          param_css_parameter,
          validation;

      var param_id = null;
      var param_css_parameter = null;

      if (event.target.id === "graphic-symbol") {
        element = $(event.target)[0];//.find("#graphic-symbol");
        newvalue = element.value.toLowerCase();

        //if user leaves url invalid and changes the symbol we want to clear url
        if ($("#external-graphic").hasClass("invalid")) {
          var externalGraphicElement = $("#external-graphic")[0];
          externalGraphicElement.value = "";
          validateFunctions.handleValidParam(externalGraphicElement);
        }
        param_id = "" + element.dataset['paramId'];
        param_name = "graphic-symbol";
        validation = validateFunctions.validateParam(element, param_name, newvalue);
        if (validation[0] === "invalid") {
          validateFunctions.handleInvalidParam(validation, element);
          return;
        } else {
          if ($(element).hasClass("invalid")) {
            validateFunctions.handleValidParam(element);
          }
          this.renderWellKnownName(newvalue);
          this.dispatcher.trigger("updateMapStyle",[{'name':'wellknownname','value': newvalue}],this.symbolType );
        }
      } else {
        element = $(event.currentTarget).find(".form-control")[0];
        param_id = "" + element.dataset['paramId'];
        param_css_parameter = element.dataset['cssParameter'];
        newvalue = element.value;
        validation = validateFunctions.validateParam(element, param_css_parameter, newvalue);
        if (validation[0] === "invalid") {
          validateFunctions.handleInvalidParam(validation, element);
          return;
        }
        if ($(element).hasClass("invalid")) {
          validateFunctions.handleValidParam(element);
        }
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
        this.dispatcher.trigger("updateMapStyleByParam",[{'name':param_css_parameter,'value': newvalue}], this.activeSymbolizer.type, this.activeSymbolizer.id );

        //console.log(paramId);

//        this.updateMapSymbolizers([{'name':param_css_parameter,'value': newvalue}], this.SLDTemplateModel);
//        this.updateMapSingleParam([{'name':param_css_parameter,'value': newvalue}], this.activeSymbolizer.id);
      }

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
      $('#is-config-saved').removeClass("hidden");
    },

    //TODO
    //Check this functions that it works correctly
    invalidValue: function(view, attr, error, selector) {
      var self = this,
          localization = locale;
      $('#savingModal').modal('hide');
      var modalTitle = localization.infoModal['errorWithSavingTitle'];
      var modalBody = attr.name;
      self.showInfoModal(modalTitle, modalBody);
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
      var self = this,
          localization = locale;
      event.preventDefault();
      $('#savingModal').modal('show');
      if(self.SLDconfigmodel.isValid(true)) {
        self.SLDconfigmodel.save({},{
          wait: true
        }).done(
          function (model, response) {
            console.log("Model saved. model: ", model, "response: ", response);
            self.configSaved = true;
            $('#is-config-saved').addClass("hidden");
            var modalTitle = localization.infoModal['modelSavedTitle'];
            var modalBody = localization.infoModal['modelSavedBody'];
            self.showInfoModal(modalTitle, modalBody, response);
            self.originalAttributes = _.cloneDeep(self.SLDconfigmodel.attributes);
          })
        .fail(
          function (model, response, options) {
            console.log("Error with saving model values. Response: ", response, "options: ", options);
            var modalTitle = localization.infoModal['errorWithSavingTitle'];
            var modalBody = localization.infoModal['errorWithSavingBody'];
            self.showInfoModal(modalTitle, modalBody, response);
        });
      }
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
    wmsPreview: function(event) {
        console.log("wmsPreview")
        event.preventDefault();
        var apiUrl = "./api/v1/configs/";
        
        var wmsPreviewModal = $('#wmsPreviewModal');
        $(wmsPreviewModal).find('#okButton').on("click", function () {
            if (window.localStorage) {
                window.localStorage.setItem('wmsUrl', $(wmsPreviewModal).find('#wmsUrl').val());
            }
            $(wmsPreviewModal).find("#wmsPreviewForm").submit();
            $(wmsPreviewModal).modal('hide');
        });

        var wmsUrl = null;
        if (window.localStorage) {
            wmsUrl = window.localStorage.getItem('wmsUrl') ? window.localStorage.getItem('wmsUrl') : null;
        }

        $(wmsPreviewModal).find('input[id=id]').val($(event.currentTarget).data('id'));
        $(wmsPreviewModal).find('input[id=wmsUrl]').val(wmsUrl);
        $(wmsPreviewModal).modal('show');
    },

    showInfoModal: function (modalTitle, modalBody, response) {
      if ($('#savingModal')) {
        $('#savingModal').modal('hide');
      }
      $('#informUserModal').on('show.bs.modal', function () {
        var modal = $(this);
        modal.find('.modal-title').text(modalTitle);
        modal.find('.modal-body').text(modalBody)
      })
      $('#informUserModal').modal('show');
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
        this.previewElement.size(50, 50);
      }
      this.previewElement.attr(this.attributes);
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
      for (var i=0; i < params.length; i++) {
        var attribute = params[i].attributeName;
        var attributeValue = params[i].value;
        if (attribute !== "stroke-width") {
          this.attributes[attribute] = attributeValue;
        }
      }
      this.previewElement = this.preview.line(10, 10, 60, 60).stroke({width: 8});
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
      this.previewElement = this.preview.rect(60,60).fill('none');
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
      //this.previewElement.center(40,40);
    },

    updatePreview: function () {
      if (_.has(this.attributes, "stroke") && (this.symbolType === "pointsymbolizer" || this.symbolType === "polygonsymbolizer")) {
        this.attributes["stroke-width"] = 3;
      }
      this.previewElement.attr(this.attributes);
    },

    logoutFromEditor: function () {
      var self = this;
      if (self.configSaved === false) {
        $('#confirmNoSave').modal('show');
        $('#continueButton').on("click", function () {
          $('#confirmNoSave').modal('hide');
          self.configSaved = true;
          window.location.href = self.getLogoutUrl();
        });
      } else {
        window.location.href = self.getLogoutUrl();
      }
    },

    getLogoutUrl: function() {
      var url = window.location.href;
      //this removes the anchor at the end, if there is one
      url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
      //this removes the query after the file name, if there is one
      url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
      url = url.substr(0, url.lastIndexOf('/')) + "/logout";
      return url;
    }

  });
  return SLDEditorView;
});
