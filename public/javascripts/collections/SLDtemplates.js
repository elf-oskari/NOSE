define([
	'lodash',
	'backbone',
	'models/sld_template'
], function(_, Backbone, SLD_template) {
	var SLDTemplatesCollection = Backbone.Collection.extend({
		model: SLD_template,
		urlRoot: "/api/v1/",
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

	return SLDTemplatesCollection;
});