define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist',
  'text!templates/SLDlist.html',
  'models/sld_config',
  'bootstrap'
], function(_, Backbone, $, locale, SLDListTemplate, SLDconfigModel) {
  var SLDMapView = Backbone.View.extend({
    el: '.map',
    render: function() {
      // create a map in the "map" div, set the view to a given place and zoom
      var container = $(this.el);
      var map = L.map(container[0]).setView([51.505, -0.09], 13);

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  });
  return SLDMapView;
});