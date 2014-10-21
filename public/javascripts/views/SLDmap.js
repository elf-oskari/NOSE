define([
  'lodash',
  'backbone',
  'jquery',
  'i18n!localization/nls/SLDlist'
], function(_, Backbone, $, locale) {
  var SLDMapView = Backbone.View.extend({
    className: 'map',
    initialize: function() {
      _.bindAll(this, 'render');
    },
    render: function() {
      // create a map in the "map" div, set the view to a given place and zoom
      var map = L.map(this.el).setView([51.505, -0.09], 13);

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  });
  return SLDMapView;
});