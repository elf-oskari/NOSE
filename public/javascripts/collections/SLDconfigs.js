define([
	'lodash',
	'backbone',
	'models/sld_config'
], function(_, Backbone, SLDConfig) {
	var SLDConfigsCollection = Backbone.Collection.extend({
		model: SLDConfig,
		urlRoot: "/api/v1/sld_configs",
		initialize: function(models) {
			if (_.isUndefined(models)) {
				this.fetch();
			}
		},
		getById: function(id) {
			return this.find(function(item) {
				return item.get('id') === id;
			});
		},
		comparator: function(item) {
			return item.get('id');
		}
	});

	return SLDConfigsCollection;
});