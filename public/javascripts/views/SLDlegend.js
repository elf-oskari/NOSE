define([
  'text!templates/SLDlegend.html',
  'i18n!localization/nls/SLDeditor',
  'lodash',
  'backbone',
  'jquery',
  'svg',
  'validation/validate'

], function(SLDLegendTemplate, locale, _, Backbone, $, SVG, validateFunctions) {
  var SLDLegendView = Backbone.View.extend({
  	className: 'SLDlegend',
    template: _.template(SLDLegendTemplate),
    events: {
            'click .closeLegend': 'closeLegend',
    },

    initialize: function(params) {
	    this.dispatcher = params.dispatcher;
	    this.listenTo(this.dispatcher, "renderLegend", this.renderLegend);
	    this.listenTo(this.dispatcher, "renderPreview", this.renderPreview);
	    this.listenTo(this.dispatcher, "setParam", this.setParam);
	    this.listenTo(this.dispatcher, "setSymbolType", this.setSymbolType);
	    this.listenTo(this.dispatcher, "symbolizerChanged", this.symbolizerChanged);
	    this.listenTo(this.dispatcher, "setSymbolizerId", this.setSymbolizerId);
	    this.listenTo(this.dispatcher, "all", this.logger);
	    this.configs = params.configs;
	    this.templates = params.templates;
	},

	renderLegend: function(event) {
		event.preventDefault();
		var self = this;
        var configId = $(event.currentTarget).data('id');
        var configModel = self.configs.getById(configId);
        var templateModel = self.templates.getById(configModel.get('template_id'));
        var SLDfeaturetypeTree = templateModel.getFeaturetypeTree();
        self.$el.html(self.template({SLDfeaturetypeTree: SLDfeaturetypeTree, locale: locale, configName: configModel.attributes.name}));

        var symbolizers = templateModel.get('sld_symbolizers');

        _.forEach(symbolizers, function (symbolizer) {
        	var params = templateModel.getParamsBySymbolizerId(symbolizer.id);
        	var paramlist = configModel.getSLDValuesByParams(params);
        	var symbolizerType = symbolizer.type.toLowerCase();
        	var previewElementId = "symbolizer-preview-" + symbolizer.id;
        	self.renderPreview(paramlist, symbolizerType, previewElementId, "small");
        });
	},

	closeLegend: function () {
	    $(this.el).empty();
	},

	symbolizerChanged: function (activeSymbolizer) {
		this.activeSymbolizer = activeSymbolizer;
	},

	renderPreview: function (params, symbolType, previewElementId, previewSize) {
	    this.attributes = {};
	    this.preview = SVG(previewElementId);
	    if (symbolType === "pointsymbolizer") {
	      this.renderPoint(params, previewSize);
	    } else if (symbolType === "linesymbolizer") {
	      this.renderLine(params, previewSize);
	    } else if (symbolType === "polygonsymbolizer") {
	      this.renderPolygon(params, previewSize);
	    } else if (symbolType === "textsymbolizer") {
	      this.renderText(params, previewSize);
	    } else {
	      console.log("geometryType of params is not defined");
	    }
	},

	renderPoint: function (params, previewSize) {
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
	      } else if (params[i].attributeName === "rotation") {
	        this.elementRotation = params[i].value;
	      } else if (params[i].attributeName !== "size"){
	        var attribute = params[i].attributeName;
	        var attributeValue = params[i].value;
	        this.attributes[attribute] = attributeValue;
	      }
	    }

	    if (previewSize	=== "small") {
	    	this.elementSize = 20;
	    } else {
	    	this.elementSize = 50;
	    }
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

	      this.previewElement = this.preview.circle(this.elementSize);
	    } else {
	      var path = this.graphicPaths[wellknownname];
	      this.previewElement = this.preview.path(path);
	      this.previewElement.size(this.elementSize);
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

	renderLine: function (params, previewSize) {
	    this.preview.clear();
	    for (var i=0; i < params.length; i++) {
	      var attribute = params[i].attributeName;
	      var attributeValue = params[i].value;
	      if (attribute !== "stroke-width") {
	        this.attributes[attribute] = attributeValue;
	      }
	    }
	    if (previewSize	=== "small") {
	    	this.previewElement = this.preview.line(10, 10, 25, 25).stroke({width: 4});
	    } else {
	    	this.previewElement = this.preview.line(10, 10, 60, 60).stroke({width: 8});
	    }
	    this.previewElement.attr(this.attributes);
	},

	renderPolygon: function (params, previewSize) {
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

	    if (previewSize	=== "small") {
	    	var elementWidth = 25;
	    	var elementHeight = 25;
	    } else {
	    	var elementWidth = 60;
	    	var elementHeight = 60;
	    }
	    this.previewElement = this.preview.rect(elementWidth,elementHeight).fill('none');
	    this.previewElement.attr(this.attributes);
	    if (strokeWidth === true) {
	      if (previewSize === "small") {
	        this.previewElement.attr({"stroke-width": 1});
	      } else {
	        this.previewElement.attr({"stroke-width": 4});
	      }
	    }
	},

	renderText: function (params, previewSize) {
	    this.preview.clear();
	    for (i=0; i < params.length; i++) {
	      var attribute = params[i].attributeName;
	      var attributeValue = params[i].value;
	      if (attribute === "font-family" || attribute === "font-style" || attribute === "font-weight" || attribute === "fill" || attribute === "halo-color" || attribute === "halo-radius") {
	        this.attributes[attribute] = attributeValue;
	      }
	    }

	    if (previewSize === "small") {
	    	this.previewElement = this.preview.text("Text!").font({size: 15});
	    } else {
	    	this.previewElement = this.preview.text("Text!").font({size: 30});
	   	}
	    this.previewElement.attr(this.attributes);
	},

	updatePreview: function () {
	    if (_.has(this.attributes, "stroke") && (this.symbolType === "pointsymbolizer" || this.symbolType === "polygonsymbolizer")) {
	      this.attributes["stroke-width"] = 3;
	    } else if (_.has(this.attributes, "size")) {
	    	this.attributes["size"] = 50;
	    }
	    this.previewElement.attr(this.attributes);
	},

	setSymbolType: function (symbolType) {
		this.symbolType = symbolType;
	},

	setSymbolizerId: function (id) {
		this.symbolizerId = id;
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
          this.dispatcher.trigger("updateMapStyleByParam",[{'name':'wellknownname','value': newvalue}],this.symbolType, this.symbolizerId);
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
        } else if (param_css_parameter !== "size") {
          this.attributes[param_css_parameter] = newvalue;
          this.updatePreview();
        }
        // Update map style
        this.dispatcher.trigger("updateMapStyleByParam",[{'name':param_css_parameter,'value': newvalue}], this.activeSymbolizer.type, this.activeSymbolizer.id );
      }

      this.dispatcher.trigger("updateModelParam", param_id, newvalue);
    }
	});

  	return SLDLegendView;

});