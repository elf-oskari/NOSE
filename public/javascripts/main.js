requirejs.config({
	baseUrl: "/javascripts/",
	paths: {
		backbone: 'lib/backbone',
		jquery: 'lib/jquery-1.10.2.min',
		lodash: 'lib/lodash',
		ol3: 'lib/ol3-v3.0.0-debug',
		i18n: 'lib/i18n',
		bootstrap: 'lib/bootstrap'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
		},
		'ol3': {
			exports: 'ol'
		}
	},
	map: {
		"*" : {
			underscore: 'lodash'
		}
	}
});

require([
	'backbone',
	'jquery',
	'lodash',
	'router',
	'bootstrap',
	'collections/SLDtemplates',
	'collections/SLDconfigs'
], function(Backbone, $, _, Router, Bootstrap, SLDTemplatesCollection, SLDConfigsCollection) {
	var WebApp = {'views': {}, 'collections': {}};
	WebApp.collections.SLDTemplatesCollection = new SLDTemplatesCollection();
	WebApp.collections.SLDConfigsCollection = new SLDConfigsCollection();

	// Creating  event dispatcher that can coordinate events among different areas of application	
	WebApp.dispatcher = _.clone(Backbone.Events);
	
	WebApp.Router = new Router(WebApp);
	// for easy debugging, do not use this variable directly
	// TODO: remove
	window.debugWebApp = WebApp;
	if (Backbone.history !== null) {
		Backbone.history.start();
	}
});