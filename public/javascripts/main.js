requirejs.config({
	paths: {
		backbone: 'lib/backbone',
		jquery: 'lib/jquery-1.10.2.min',
		lodash: 'lib/lodash',
		i18n: 'lib/i18n',
		bootstrap: 'lib/bootstrap'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
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
    var initialLocation = window.location.href.substring(0, window.location.href.indexOf('index'));
	console.log(initialLocation, Backbone, $, _, Router, SLDTemplatesCollection);
	window._ = _;
	window.Backbone = Backbone;
	window.WebApp = {'views': {}, 'collections': {}};
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
					"name":"",
					"title":"",
					"feturetype_name":""
				},		
				{
					"id":"345",
					"template_id":"265",
					"order":"2",
					"name":"",
					"title":"",
					"feturetype_name":""
				}
			],
			"sld_rules": [
				{
					"id":"132",
					"featuretype_id":"245",
					"name":"",
					"title":"",
					"abstract":""
				},
				{
					"id":"632",
					"featuretype_id":"245",
					"name":"",
					"title":"",
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
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
				},
				{
					"id":"1288",
					"rule_id":"132",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
				},
				{
					"id":"1432",
					"rule_id":"632",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
					},
				{
					"id":"1433",
					"rule_id":"632",
					"template_offset":"5323",
					"default_value":"#893281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
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
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
				},
				{
					"id":"1212",
					"rule_id":"132",
					"template_offset":"2423",
					"default_value":"#122341",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
				},
				{
					"id":"1433",
					"rule_id":"432",
					"template_offset":"5663",
					"default_value":"#213281",
					"type_id":"324",
					"name":"line_width",
					"symbolizer":"LineSymbolizer/Stroke/CssParameter(stroke)"
				}
			]
		}
	];
	window.WebApp.collections.SLDTemplatesCollection = new SLDTemplatesCollection(slds);
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
	window.WebApp.collections.SLDConfigsCollection = new SLDConfigsCollection(configs);		
	console.log('Creating Router', window.WebApp);
	window.WebApp.Router = new Router(window.WebApp);
	if (Backbone.history !== null) {
		Backbone.history.start();
	}
});