define([
	'lodash',
	'backbone',
	'text!templates/SLDlist.html'
], function(_, Backbone, SLDListTemplate) {
	var SLDListView = Backbone.View.extend({
		el: '.page',
		template: _.template(SLDListTemplate),
		initialize: function(params) {
            _.bindAll(this, 'render');
            this.configs = params.configs;
            this.templates = params.templates;
            console.log(this, arguments);
            console.log('AuthorView Initialized!', this.collection);
        },
        render: function() {
            $(this.el).html(this.template({SLDtemplates: this.templates.models, SLDconfigs: this.configs.models}));
            return this;
        },
	});
	return SLDListView;
});
