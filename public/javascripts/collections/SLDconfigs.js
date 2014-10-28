define([
	'lodash',
	'backbone',
	'models/sld_config'
], function(_, Backbone, SLDConfig) {
	var SLDConfigsCollection = Backbone.Collection.extend({
		model: SLDConfig,
		url: "/api/v1/configs",
		initialize: function(models) {
			if (_.isUndefined(models)) {
				// TODO: bootstrap collections in application.html
				// http://backbonejs.org/#Collection-fetch
				this.fetch({reset: true});
			}
		},
		getById: function(id) {
			return this.get(id);
		},
		getConfigTree: function() {
			return this.models.map(function (item) {
				return item.pick('id', 'name', 'template_id');
			});
		},
		comparator: function(item) {
			return item.get('id');
		}
	});

	return SLDConfigsCollection;
});