requirejs.config({
	baseUrl: "./javascripts/",
	paths: {
		backbone: 'lib/backbone',
		jquery: 'lib/jquery-1.10.2.min',
		lodash: 'lib/lodash',
		ol3: 'lib/ol3-v3.0.0-debug-modified'
	},
	shim: {
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
	'ol3',
	'views/WMSPreview'
], function(Backbone, $, _, ol3, WMSPreviewView) {
	var configId = $("#configId").val();
	var WMSPreview = new WMSPreviewView({id: configId});
});