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
		urlRoot: "/api/v1/configs",
		initialize: function() {
			this.on('change', function(e){
				console.log('Change triggered', e);
			});
		},
		validate: function(attributes) {
			console.log('Validating...', attributes, this.isNew());

			if (!this.isNew() && !_.isString(attributes.id)) {
				return "Id must be a string.";
			}
			if (!_.isString(attributes.name)) {
				return "Name must be a string.";
			}
		}
	});

	return SLDconfigModel;
});