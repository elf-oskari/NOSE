define(['lodash','backbone'], function(_, Backbone) {
	var SLDconfigModel = Backbone.Model.extend({
		defaults: {
			id: null,
			uuid: null,
			template_id: null,
			name: null,
			output_path: null,
			created: null,
			updated: null
		},
		urlRoot: "./api/v1/configs",

		//TODO
		// Validate model
		validation: {
			name: {
				required: true,
				msg: 'Model name is not valid!'
			},
			template_id: {
				required: true
			},
			id: {
				required: true
			}
			/** next are all attributes of the model, but they don't have validation yet
			created: {

			output_path: {

			}
			sld_values: {
				// values are validated before setting them to model
			}
			updated: {

			}
			uuid: {

			}
			*/
		},

		/**
		validate: function(attributes) {
			debugger;
			console.log('Validating...', attributes, this.isNew());

			if (!this.isNew() && !_.isString(attributes.id)) {
				return "Id must be a string.";
			}
			if (!_.isString(attributes.name)) {
				return "Name must be a string.";
			}
		},
		*/
		getSLDValuesByParams: function(params) {
			var sld_values = this.get('sld_values');
			var valueslist = _.map(params, function (param) {
				var newparam = _.findWhere(sld_values, {"param_id" : param.id});
					newparam.name = param.param_path;
					newparam.attributeName = param.name;
					return newparam;
				});
			return valueslist;
		},
        /**
         * @method getRuleById
         * @return {Object} the rule matching the id or null if not found
         */
        getRuleById: function(ruleId) {
        	var me = this;
        	var rules = _.where(me.get('sld_rules'), { id: ruleId });      	
			return (rules && rules.length === 1) ? rules[0] : null;
        },
        /**
	 	 * Get the rule of this config-instance, that corresponds to the rule of the template that the symbolizer is bound to...Beautiful...
	 	 * TODO: refactor the whole db - make symbolizers (and thus params and thus values as well) be per config, not per template
         */
        getRuleCorrespondingToTemplateRule: function(templateRule) {
        	var me = this;
        	var rules = _.where(me.get('sld_rules'), {
        		template_rule_id: templateRule.id 
        	});

        	return rules && rules.length === 1 ? rules[0] : null;
        },
		getFeaturetypeTreeRules: function(SLDTemplateModel) {
			var SLDrules = this.get('sld_rules');
			var SLDsymbolizers = SLDTemplateModel.get('sld_symbolizers');

			var rules = _.map(SLDrules, function (SLDrule) {
				var rule = _.pick(SLDrule, 'id', 'title');
				var symbolizers = _.where(SLDsymbolizers, {rule_id: SLDrule.template_rule_id});
				rule.symbolizers = _.map(symbolizers, function (SLDsymbolizer) {
					var symbolizer = _.pick(SLDsymbolizer, 'id', 'type');
					return symbolizer;
				});
				return rule;
			});
			return rules;
		}
	});

	return SLDconfigModel;
});