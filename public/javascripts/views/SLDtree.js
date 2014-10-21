define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist',
  'text!templates/SLDtree.html',
  'models/sld_config',
  'models/sld_template',
  'bootstrap'
], function(_, Backbone, $, locale, SLDTreeTemplate, SLDtemplateModel, SLDconfigModel) {
  var SLDTreeView = Backbone.View.extend({
    className: 'tree',
    template: _.template(SLDTreeTemplate),
    events: {
      'click .btn.sld_param': 'updateSLDeditor'
    },
    initialize: function(params) {
      this.SLDtemplatemodel = new SLDtemplateModel(params.SLDtemplatemodel.toJSON());
      this.SLDconfigmodel = new SLDconfigModel(params.SLDconfigmodel.toJSON());
      this.SLDfeaturetypeTree = this.constructFeaturetypeTree(this.SLDtemplatemodel);

      _.bindAll(this, 'render');
    },

    setModels: function(models) {
        this.SLDtemplatemodel.set(models.SLDtemplatemodel.toJSON());
        this.SLDconfigmodel.set(models.SLDconfigmodel.toJSON());
        this.SLDfeaturetypeTree = this.constructFeaturetypeTree(this.SLDtemplatemodel);
        return this;
    },

    constructFeaturetypeTree: function(SLDtemplatemodel) {
      var SLDfeaturetypes = SLDtemplatemodel.get('sld_featuretypes');
      var SLDrules = SLDtemplatemodel.get('sld_rules');
      var SLDparams = SLDtemplatemodel.get('sld_params');
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
      this.$el.html(this.template({SLDfeaturetypeTree: this.SLDfeaturetypeTree, locale: locale}));
      return this;
    },

    updateSLDeditor: function(params) { 
      console.log(params);
      debugger;
    }
  });
  return SLDTreeView;
});
