requirejs.config({
	baseUrl: "./javascripts/",
	paths: {
		backbone: 'lib/backbone',
		jquery: 'lib/jquery-1.10.2.min',
		lodash: 'lib/lodash',
		ol3: 'lib/ol3-v3.0.0-debug-modified',
		i18n: 'lib/i18n',
		bootstrap: 'lib/bootstrap',
		svg: 'lib/svg'
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
	var WebApp = {
		'views': {},
		'collections': {},
		// Creating  event dispatcher that can coordinate events among different areas of application	
		'dispatcher': _.clone(Backbone.Events)
	};
	_.extend(WebApp, Backbone.Events);

	// for easy debugging, do not use this variable directly
	// TODO: remove
	window.debugWebApp = WebApp;

	// Create, these will be added to WebApp after resets
	var templates = new SLDTemplatesCollection();
	var configs = new SLDConfigsCollection();

	var forceStart = function() {
		if (!WebApp.collections.SLDTemplatesCollection) {
			WebApp.collections.SLDTemplatesCollection = templates;
		} else if (!WebApp.collections.SLDConfigsCollection) {
			WebApp.collections.SLDConfigsCollection = configs;
		}

		// Everything is setup, so we can start
		WebApp.start({url: "forced"});
	}
	var forceTimer = window.setTimeout(forceStart, 10000);

	WebApp.start = function (event) {
		if (_.contains(event.url, "templates")) {
			WebApp.collections.SLDTemplatesCollection = event;
		} else if (_.contains(event.url, "configs")) {
			WebApp.collections.SLDConfigsCollection = event;
		}

		// has everything been loaded?
		// TODO: bootstrap collections in application.html
		// http://backbonejs.org/#Collection-fetch
		if (_.isObject(WebApp.collections.SLDTemplatesCollection) &&
			_.isObject(WebApp.collections.SLDConfigsCollection)) {

			// Everything is setup, so we can cancel the forceTimer
			window.clearTimeout(forceTimer);

			WebApp.Router = new Router(WebApp);

			if (Backbone.history !== null) {
				Backbone.history.start();
			}
		}
	}

	// We wait until the collections are ready
	WebApp.listenToOnce(templates, "reset", WebApp.start);
	WebApp.listenToOnce(configs, "reset", WebApp.start);

});
