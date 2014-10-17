define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist',
  'text!templates/SLDtree.html',
  'bootstrap'
], function(_, Backbone, $, locale, SLDTreeTemplate) {
  var SLDTreeView = Backbone.View.extend({
    el: '.tree',
    template: _.template(SLDTreeTemplate),
    events: {
      'click .btn.sld_param': 'updateSLDeditor'
    },
    initialize: function(params) {
      SLDconfigmodel = params.SLDconfigmodel;
      template_id = SLDconfigmodel.get('template_id');
      SLDtemplatemodel = window.WebApp.collections.SLDTemplatesCollection.get(template_id);
      featuretypes = SLDtemplatemodel.get('sld_featuretypes');
      SLDrules = SLDtemplatemodel.get('sld_rules');
      SLDparams = SLDtemplatemodel.get('sld_params');
      _.bindAll(this, 'render');
      console.log(this, arguments);
      console.log('AuthorView Initialized!', this.collection);
    },

    render: function() {
      console.log('collection', window.WebApp.collections.SLDTemplatesCollection);
      $(this.el).html(this.template({SLDfeaturetypes: featuretypes, SLDrules: SLDrules, SLDparams: SLDparams, locale: locale, SLDvalues: SLDconfigmodel.get('sld_values')}));
      return this;
    },

    updateSLDeditor: function(params) {
      console.log(params);
      debugger;
    }
  });
  return SLDTreeView;
});
