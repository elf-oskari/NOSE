define(['lodash','backbone','i18n!localization/nls/SLDeditor'], function(_, Backbone, locale) {
	var SLDtemplateModel = Backbone.Model.extend({
		defaults: {
			id: null,
			uuid: null,
			name: null,
			content: null,
			created: null,
			updated: null,
			wms_url: null
		},
		urlRoot: "./api/v1/templates",
		validate: function(attributes) {
			console.log('Validating...', attributes, this.isNew());
			if (attributes.id === null || attributes.id === "") {
				return "Id cannot be null or empty.";
			}
			if (attributes.name === null || attributes.name === "") {
				return "Name cannot be null or empty.";
			}
		},
		getDefaultConfigSLDValues: function() {
			var SLDparams = this.get('sld_params');
			return SLDparams.map(function (param) {
				// rename id to param_id before returning
				return {param_id: param.id, value: param.default_value};
			});
		},

		/**
	     * @method getFeaturetypeTree
	     * Constructs the featuretypetree of sld configuration 
	     * Tree structure from up to bottom
	     * @return {Array} list of featuretype objects
	     */
		getFeaturetypeTree: function() {
			var SLDfeaturetypes = this.get('sld_featuretypes');
			var SLDrules = this.get('sld_rules');
			var SLDsymbolizers = this.get('sld_symbolizers');
			var SLDparams = this.get('sld_params');

			return _.map(SLDfeaturetypes, function (SLDfeatureType) {
				var featuretype = _.pick(SLDfeatureType, 'id', 'name');
				if (featuretype.name === "") {
					featuretype.name = locale.sldtree.featuretypeWithoutName;
				}
				var rules = _.where(SLDrules, {featuretype_id: featuretype.id});
				featuretype.rules = _.map(rules, function (SLDrule) {
					var rule = _.pick(SLDrule, 'id', 'title');
					var symbolizers = _.where(SLDsymbolizers, {rule_id: rule.id});
					rule.symbolizers = _.map(symbolizers, function (SLDsymbolizer) {
						var symbolizer = _.pick(SLDsymbolizer, 'id', 'type');
						return symbolizer;
					});
					return rule;
				});
				return featuretype;
			});
		},

		/**
	     * @method getParamsBySymbolizerId
	     * @return {Array} list sld_params that match the given symbolizer_id
	     */
		getParamsBySymbolizerId: function(symbolizer_id) {
			var SLDparams = this.get('sld_params');
			var paramlist = _.where(SLDparams, {'symbolizer_id': symbolizer_id});
			return paramlist;
		},
        /**
         * @method getSymbolizerById
         * @return {Array} symbolizer properties that match the given id
         */
        getSymbolizerById: function(id) {
            var SLDsymbolizers = this.get('sld_symbolizers');
            var symbolizerlist = _.where(SLDsymbolizers, {'id': id});
            return symbolizerlist;
        },
        /**
         * @method getRuleIdByParams
         * @return {Integer} ruleid of the currently selected symbolizer
         */
        getRuleIdByParams: function(params) {
			var self = this;
			var symbolizers = [];
			_.each(params, function(item) {
				symbolizers.push(_.where(self.get('sld_symbolizers'), {id: item.symbolizer_id}));
			});

		  //pluck the rule id from the symbolizers' array
	      return _.uniq(_.pluck(_.flatten(symbolizers), 'rule_id'))[0];
        },
        /**
         * @method getRuleIdByParams
         * @return {Array} all symbolizers of the currently selected rule
         */
        getSymbolizersByRuleId: function(ruleid) {
			return _.where(this.get('sld_symbolizers'), {rule_id: ruleid});
        }
	});

	return SLDtemplateModel;
});