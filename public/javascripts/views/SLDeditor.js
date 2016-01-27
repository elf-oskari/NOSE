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
        'click .cancel-changes':'resetModel',
        'keyup .rule-input':'updateRule',
        'keyup .param': 'setParam',
        'change .param': 'setParam'
    },

    initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.symbolizerChanged);
      this.listenTo(this.dispatcher, "backToList", this.back);
      this.listenTo(this.dispatcher, "saveConfig", this.saveConfig);
      this.listenTo(this.dispatcher, "configSaved", this.showInfoModal);
      this.listenTo(this.dispatcher, "resetModel", this.resetModel);
      this.listenTo(this.dispatcher, "wmsPreview", this.wmsPreview);
      this.listenTo(this.dispatcher, "updateModelParam", this.updateModelParam);
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
        this.dispatcher.trigger("setSymbolType", this.symbolType);

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
          var previewElementId = 'preview';
          $(this.el).find(".preview-frame").removeClass("hidden");
          this.dispatcher.trigger("renderPreview", paramlist, type, previewElementId);
          $(this.el).find(".symbolizer-chosen").removeClass("hidden");
          $(this.el).find(".info-text").addClass("hidden");
        }
        return this;
    },

    setParam: function (event) {
      this.dispatcher.trigger("setParam", event);
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
      self.dispatcher.trigger("symbolizerChanged", this.activeSymbolizer);

      this.SLDTemplateModel = SLDTemplateModel;
      //symbolizerchange -> toggle point, line and polygon layers off by default (they get toggled on as needed when symbolizers of the rule are added)
      this.dispatcher.trigger("resetVectorLayers");
      this.dispatcher.trigger("setSymbolizerId", symbolizer.id);
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

    /**
     * @method updateModelParam
     * Updates SLDeditor configurationModel parameter
     */
    updateModelParam: function (param_id, newvalue) {
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
