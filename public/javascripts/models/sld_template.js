define(['lodash','backbone'], function(_, Backbone) {
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
		urlRoot: "/api/v1/templates",
		initialize: function() {
			this.on('change', function(e){
				console.log('Change triggered', e);
			});
		},
		validate: function(attributes) {
			console.log('Validating...', attributes);
			if (attributes.id === null || attributes.id === "") {
				return "Id cannot be null or empty.";
			}
			if (attributes.name === null || attributes.name === "") {
				return "Name cannot be null or empty.";
			}
		},

		/**
	     * @method getFeaturetypeTree
	     * Constructs the featuretypetree of sld configuration 
	     * Tree structure from up to bottom: featuretypes > rules > symbolizergroups
	     * @return {Array} list of featuretype objects
	     */
		getFeaturetypeTree: function() {
			var SLDfeaturetypes = this.get('sld_featuretypes');
			var SLDrules = this.get('sld_rules');
			var SLDparams = this.get('sld_params');
			var featuretypes = [];
			_.forEach(SLDfeaturetypes, function(SLDfeatureType) {
				featuretypes.push(SLDfeatureType);
				var rules = [];
				_.forEach(SLDrules, function(SLDrule) { 
					if (SLDrule.featuretype_id === SLDfeatureType.id) {
						rules.push(SLDrule);
						var symbolizer_groups = [];
						_.forEach(SLDparams, function(SLDparam) { 
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

		/**
	     * @method getParamsBySymbolizergroup
	     * @return {Array} list sld_params that match the given symbolizer_group and rule_id
	     */
		getParamsBySymbolizergroup: function(symbolizer_group, rule_id) {
			var sldparams = this.get('sld_params');
			var paramlist = _.filter(sldparams, {'symbolizer_group' : symbolizer_group, 'rule_id' : rule_id});
			return paramlist;

		}
	});

	return SLDtemplateModel;
});