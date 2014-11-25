define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist',
  'text!templates/SLDtree.html',
  'models/sld_config',
  'models/sld_template',
  'bootstrap'
], function(_, Backbone, $, locale, SLDTreeTemplate, SLDconfigModel, SLDtemplateModel) {
  var SLDTreeView = Backbone.View.extend({
    className: 'tree',
    template: _.template(SLDTreeTemplate),
    events: {
      'click .btn.sld_symbolizer': 'updateSLDeditor'
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
      this.$el.html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: locale}));
      return this;
    },

    updateSLDeditor: function(event) {
      // JQuery probably parses numers as strings to numbers and therefore the symbolizer_id must be formatted to string
      var symbolizer_id = "" + $(event.currentTarget).data('symbolizerid');
      var symbolizer_type = String($(event.currentTarget).data('symbolizertype')).toLowerCase();
      var params = this.SLDtemplatemodel.getParamsBySymbolizerId(symbolizer_id);
      console.log('sid', symbolizer_id, 'params', params, 'model', this.SLDtemplatemodel);
      this.dispatcher.trigger("selectSymbolizer", params, symbolizer_type);
    }
  });
  return SLDTreeView;
});
