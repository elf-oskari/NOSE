requirejs.config({
	paths: {
		backbone: 'lib/backbone',
		jquery: 'lib/jquery-1.10.2.min',
		lodash: 'lib/lodash'
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
	'collections/SLDtemplates',
	'collections/SLDconfigs'
], function(Backbone, $, _, Router, SLDTemplatesCollection, SLDConfigsCollection) {
    var initialLocation = window.location.href.substring(0, window.location.href.indexOf('index'));
	console.log(initialLocation, Backbone, $, _, Router, SLDTemplatesCollection);
	window._ = _;
	window.Backbone = Backbone;
	window.WebApp = {'views': {}, 'collections': {}};
	var slds = [	{'id': '2', 'name': 'rautatiet'},
					{'id': '1', 'name': 'maantiet'}];
	window.WebApp.collections.SLDTemplatesCollection = new SLDTemplatesCollection(slds);
	var configs = [	{'id': '1', 'name': 'rautatiet_pun', 'template_id' : '2'},
					{'id': '2', 'name': 'rautatiet_sin', 'template_id' : '2'},
					{'id': '3', 'name': 'maantiet_pun', 'template_id' : '1'},
					{'id': '4', 'name': 'maantiet_sin', 'template_id' : '1'}];
	window.WebApp.collections.SLDConfigsCollection = new SLDConfigsCollection(configs);			
	console.log('Creating Router', window.WebApp);
	window.WebApp.Router = new Router(window.WebApp);
	if (Backbone.history !== null) {
		Backbone.history.start();
	}
});