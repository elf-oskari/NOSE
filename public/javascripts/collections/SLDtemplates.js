define([
	'lodash',
	'backbone',
	'models/sld_template'
], function(_, Backbone, SLD_template) {
	var SLDTemplatesCollection = Backbone.Collection.extend({
		model: SLD_template,
		url: "/api/v1/templates",
		initialize: function(models) {
			if (_.isUndefined(models)) {
				this.fetch();
			}
		},
		getById: function(id) {
			return this.get(id);
		},
		getTemplateConfigTree: function(configs) {
			return this.models.map(function (item) {
				var template = item.pick('id', 'name');
				template.configs = _.where(configs, {template_id: template.id});
				return template;
			});
		},
		comparator: function(item) {
			return item.get('id');
		}
	});

	return SLDTemplatesCollection;
});