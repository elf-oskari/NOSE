requirejs.config({
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
	var slds = [
		{
			"id":"265",
			"uuid":"12f42-cd342-2e3e4-a3423",
			"name":"Kivatyyli",
			"output_path":"null",
			"created":"2014-08-11 11:14:46.08888+03",
			"updated":"2014-08-11 11:14:46.08888+03",
			"wms_url":"#????#",
			"sld_featuretypes": [
				{
					"id":"245",
					"template_id":"265",
					"order":"1",
					"name":"Earth",
					"title":"",
					"feturetype_name":""
				},		
				{
					"id":"345",
					"template_id":"265",
					"order":"2",
					"name":"Water",
					"title":"",
					"feturetype_name":""
				}
			],
			"sld_rules": [
				{
					"id":"132",
					"featuretype_id":"245",
					"name":"",
					"title":"Roads",
					"abstract":""
				},
				{
					"id":"632",
					"featuretype_id":"345",
					"name":"",
					"title":"Rivers",
					"abstract":""
				}
			],
			"sld_params": [ 
				{
					"id":"1273",
					"rule_id":"132",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_fill",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
				},
				{
					"id":"1288",
					"rule_id":"132",
					"template_offset":"5323",
					"default_value":"2",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke-width)",
					"symbolizer_group": "LineSymbolizer1"
				},
				{
					"id":"1841",
					"rule_id":"132",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_fill",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer2"
				},
				{
					"id":"1288",
					"rule_id":"132",
					"template_offset":"5323",
					"default_value":"3",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke-width)",
					"symbolizer_group": "LineSymbolizer2"
				},
				{
					"id":"1432",
					"rule_id":"632",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
					},
				{
					"id":"1433",
					"rule_id":"632",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
				}
			]
		},
		{
			"id":"365",
			"uuid":"52f44-ca242-2e3e4-111aa",
			"name":"Rautatiet",
			"output_path":"null",
			"created":"2014-08-11 11:14:46.08888+03",
			"updated":"2014-08-11 11:14:46.08888+03",
			"wms_url":"#????#",
			"sld_featuretypes": [
				{
					"id":"445",
					"template_id":"365",
					"order":"1",
					"name":"",
					"title":"",
					"feturetype_name":""
				}
			],
			"sld_rules": [
				{
					"id":"132",
					"featuretype_id":"445",
					"name":"",
					"title":"",
					"abstract":""
				},
				{
					"id":"432",
					"featuretype_id":"445",
					"name":"",
					"title":"",
					"abstract":""
				}
			],
			"sld_params": [
				{
					"id":"1211",
					"rule_id":"132",
					"template_offset":"1223",
					"default_value":"#233281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
				},
				{
					"id":"1212",
					"rule_id":"132",
					"template_offset":"2423",
					"default_value":"#122341",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
				},
				{
					"id":"1433",
					"rule_id":"432",
					"template_offset":"5663",
					"default_value":"#213281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)",
					"symbolizer_group": "LineSymbolizer1"
				}
			]
		}
	];
	WebApp.collections.SLDTemplatesCollection = new SLDTemplatesCollection(slds);
	var configs = [
		{
			"id":"435",
			"uuid":"17742-caa42-a34e4-a3ff3",
			"name":"Kivatyyli_oma_sld",
			"template_id":"265",
			"output_path":"null",
			"created":"2014-02-09 11:14:46.08888+03",
			"updated":"2014-02-09 11:14:46.08888+03",
			"wms_url":"#????#",
			"sld_values": [
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"1273",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"1288",
					"data":"2"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"??",
					"data":"#c832d8"
				},

			],
		},
		{
			"id":"436",
			"uuid":"17742-caa42-a34e4-a3ff3",
			"name":"Kivatyyli_oma_sld2",
			"template_id":"265",
			"output_path":"null",
			"created":"2014-02-09 11:14:46.08888+03",
			"updated":"2014-02-09 11:14:46.08888+03",
			"wms_url":"#????#",
			"sld_values": [
				{
					"id":"123242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				},
				{
					"id":"243242",
					"config_id":"435",
					"param_id":"",
					"data":"#c832d8"
				}
			]
		}
	];
	WebApp.collections.SLDConfigsCollection = new SLDConfigsCollection(configs);

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