define([
  'lodash',
  'backbone',
  'jquery',
  'ol3'
], function(_, Backbone, $, ol) {
  var WMSPreviewView = Backbone.View.extend({
  	el: 'map',
  	url: null,
    initialize: function(params) {
    	var self = this;
    	console.log("WMSPreviewView.initialize");
    	this.url = './api/v1/configs/'+params.id+'/wmspreview/';
		_.bindAll(this, 'render');

		$.ajax({
			type: "POST",
			url: self.url,
			success: function(result) {
//		    	this.sld = encodeURIComponent(result);
		    	self.render();
			}, 
			error: function(error) {
		    	self.render();
			}
		});
	},
	render: function() {
        // create a map in the "map" div, set the view to a given place and zoom
        var self = this;
		var wms = new ol.layer.Tile({
		            title: "Preview WMS",
		            source: new ol.source.TileWMS({
		              url: self.url+"getmap",
		              params: {
		              	VERSION: '1.1.1'
		              }
		            })
		          });

        if (!this.map) {
	        this.map = new ol.Map({
	            controls: ol.control.defaults().extend([new ol.control.ScaleLine(), new ol.control.MousePosition()]),
	            layers: [
	                new ol.layer.Tile({
	                    source: new ol.source.MapQuest({layer: 'osm'}),
	                    opacity: 0.5,
	                    title: 'OSM'
	                })
	                ,
	                wms
	            ],
	            target: 'map',
	            view: new ol.View({
//	                center: [-412981, 4927495],
//	                center:[382585, 6677143],
	                center:[2776644, 8436948],
	                zoom: 7
	            })
	        });
	        zoomslider = new ol.control.ZoomSlider();
	        this.map.addControl(zoomslider);
	        var layerSwitcher = new ol.control.LayerSwitcher();
	        this.map.addControl(layerSwitcher);
	    }

	}  	
  });

  return WMSPreviewView;

});
