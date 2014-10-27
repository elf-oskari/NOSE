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
      console.log('got tree', this.SLDfeaturetypeTree);
      this.$el.html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: locale}));
      return this;
    },

    updateSLDeditor: function(event) {
      var symbolizer_id = $(event.currentTarget).data('symbolizerid');
      console.log('continue here');
      // JQuery probably parses numers as strings to numbers and therefore the ruleid must be formatted to string
      this.dispatcher.trigger("selectSymbolizer", this.SLDtemplatemodel.getParamsBySymbolizerId(symbolizer_id));
    }
  });
  return SLDTreeView;
});
