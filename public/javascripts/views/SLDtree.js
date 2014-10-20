define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist',
  'text!templates/SLDtree.html',
  'bootstrap'
], function(_, Backbone, $, locale, SLDTreeTemplate) {
  var SLDTreeView = Backbone.View.extend({
    template: _.template(SLDTreeTemplate),
    events: {
      'click .btn.sld_param': 'updateSLDeditor'
    },
    initialize: function(params) {
      this.el = '.tree';
      this.SLDconfigmodel = params.SLDconfigmodel;
      this.SLDtemplatemodel = params.SLDtemplatemodel;
      var SLDfeaturetypes = this.SLDtemplatemodel.get('sld_featuretypes');
      var SLDrules = this.SLDtemplatemodel.get('sld_rules');
      var SLDparams = this.SLDtemplatemodel.get('sld_params');
      this.SLDfeaturetypeTree = this.constructFeaturetypeTree(SLDfeaturetypes, SLDrules, SLDparams);
      _.bindAll(this, 'render');
      console.log(this, arguments);
      console.log('AuthorView Initialized!', this.collection);
    },

    constructFeaturetypeTree: function(SLDfeaturetypes, SLDrules, SLDparams) {
      var featuretypes = [];
      _.forEach(SLDfeaturetypes, function(SLDfeatureType, index) {
        featuretypes.push(SLDfeatureType);
        var rules = [];
        _.forEach(SLDrules, function(SLDrule, index) { 
          if (SLDrule.featuretype_id === SLDfeatureType.id) {
            rules.push(SLDrule);
            var symbolizer_groups = [];
            _.forEach(SLDparams, function(SLDparam, index) { 
              if (SLDparam.rule_id === SLDrule.id) {
                if (!_.contains(symbolizer_groups, SLDparam.symbolizer_group)) {
                  symbolizer_groups.push(SLDparam.symbolizer_group);
                }
              }
            });
            SLDrule.symbolizer_groups = symbolizer_groups;
          }
        });
        SLDfeatureType.rules = rules;
      });
      return featuretypes;
    },
    render: function() {
      $(this.el).html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: locale}));
      return this;
    },

    updateSLDeditor: function(params) { 
      console.log(params);
      debugger;
    }
  });
  return SLDTreeView;
});
