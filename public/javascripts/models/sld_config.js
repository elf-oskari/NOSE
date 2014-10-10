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
		urlRoot: "/api/v1/authors",
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
		}
	});

	return SLDconfigModel;
});