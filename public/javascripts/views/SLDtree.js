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
      'click .btn.sld_param': 'updateSLDeditor'
    },
    initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.SLDtemplatemodel = new SLDtemplateModel(params.SLDtemplatemodel.toJSON());
      this.SLDconfigmodel = new SLDconfigModel(params.SLDconfigmodel.toJSON());
      this.SLDfeaturetypeTree = this.SLDtemplatemodel.getFeaturetypeTree();
      _.bindAll(this, 'render');
    },

    setModels: function(models) {
        this.SLDtemplatemodel.set(models.SLDtemplatemodel.toJSON());
        this.SLDconfigmodel.set(models.SLDconfigmodel.toJSON());
        this.SLDfeaturetypeTree = this.SLDtemplatemodel.getFeaturetypeTree();
        return this;
    },

    render: function() {
      console.log(this.dispatcher);
      this.$el.html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: locale}));
      return this;
    },

    updateSLDeditor: function(event) {
      var symbolizer_group = $(event.currentTarget).data('symbolizergroup');
      // JQuery probably parses numers as strings to numbers and therefore the ruleid must be formatted to string
      var rule_id = "" + $(event.currentTarget).data('ruleid');
      this.dispatcher.trigger("selectSymbolizer", this.SLDtemplatemodel.getParamsBySymbolizergroup(symbolizer_group, rule_id));
    }
  });
  return SLDTreeView;
});
