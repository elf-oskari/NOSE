define([
  'lodash',
  'backbone',
  'jquery',
  'chosen',
  'i18n!localization/nls/SLDeditor',
  'text!templates/SLDtree.html',
  'models/sld_config',
  'models/sld_template',
  'bootstrap'
], function(_, Backbone, $, chosen, locale, SLDTreeTemplate, SLDconfigModel, SLDtemplateModel) {
  var SLDTreeView = Backbone.View.extend({
    className: 'tree',
    template: _.template(SLDTreeTemplate),
    events: {
      'click .btn.sld_symbolizer': 'updateSLDeditor',
      'click .collapse-panel-tree': 'panelClicked',
      'change .chosen-select': 'updateSLDtree'
    },
    initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.SLDtemplatemodel = params.SLDtemplatemodel;
      this.SLDconfigmodel = params.SLDconfigmodel;
      this.SLDfeaturetypeTree = this.SLDtemplatemodel.getFeaturetypeTree();
      _.bindAll(this, 'render');
    },

    setModels: function(models) {
        this.SLDtemplatemodel = models.SLDtemplatemodel;
        this.SLDconfigmodel = models.SLDconfigmodel;
        this.SLDfeaturetypeTree = this.SLDtemplatemodel.getFeaturetypeTree();
        return this;
    },

    render: function() {
      this.locale = locale;
      this.$el.html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: this.locale}));
      $(".chosen-select").chosen();
      return this;
    },

    updateSLDeditor: function(event) {
      // JQuery probably parses numers as strings to numbers and therefore the symbolizer_id must be formatted to string
      var symbolizer_id = "" + $(event.currentTarget).data('symbolizerid');
      var symbolizer_type = String($(event.currentTarget).data('symbolizertype')).toLowerCase();
      var ruletitle = $(event.currentTarget).data('ruletitle');
      var params = this.SLDtemplatemodel.getParamsBySymbolizerId(symbolizer_id);
      var symbolizer = this.SLDtemplatemodel.getSymbolizerById(symbolizer_id);
      console.log('sid', symbolizer_id, 'params', params, 'model', this.SLDtemplatemodel);
      this.dispatcher.trigger("selectSymbolizer", params, symbolizer[0], ruletitle, this.SLDtemplatemodel);



    },

    panelClicked: function(event) {
      debugger;
      var element = $(event.currentTarget)[0].children[0];
      var panelHeadingElement = event.currentTarget.parentElement;
      this.panelClickedHandler(element, panelHeadingElement);
    },

    panelClickedHandler: function(element, panelHeadingElement) {
      if ($(panelHeadingElement).hasClass("open")) {
        element.setAttribute("class", "fa fa-caret-right pull-left");
        $(panelHeadingElement).removeClass("open");
      } else {
        element.setAttribute("class", "fa fa-caret-down pull-left");
        $(panelHeadingElement).addClass("open");
      }
    },

    updateSLDtree: function(event) {
      var me = this,
          panelHeadingElement;
      var optionValue = event.target.value;

      var options = optionValue.split(",");
      _.forEach(options, function(option) {
        var optionElement = $("#" + option);
        optionElement.collapse('show');
        panelHeadingElement = optionElement[0].parentElement.children[0];
        var element = panelHeadingElement.children[0].children[0];
        if (!$(panelHeadingElement).hasClass("open")) {
          me.panelClickedHandler(element, panelHeadingElement);
        }
      });
      var offsetTop = panelHeadingElement.offsetTop;
      $(".panel-body.sld-tree").scrollTop(offsetTop);
    }
  });
  return SLDTreeView;
});
