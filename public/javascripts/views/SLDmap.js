define([
  'lodash',
  'backbone',
  'jquery',
  'leaflet',
  'i18n!localization/nls/SLDlist'
], function(_, Backbone, $, Leaflet, locale) {
  var SLDMapView = Backbone.View.extend({
    className: 'map',
    initialize: function() {
      _.bindAll(this, 'render');
    },
    render: function() {
      // create a map in the "map" div, set the view to a given place and zoom
      if (!this.map) {
        this.map = Leaflet.map(this.el);
        // add an OpenStreetMap tile layer
        Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
      } else {
        // map node has been detached.
        // Note! event handling might not function properly, but since we currently do not have any map specific
        // event handling, this is not tested. Look at assign in SLDEditorPage for more details.
        this.$el.replaceWith(this.map.getContainer());
      }
      this.map.setView([51.505, -0.09], 13);
    }
  });
  return SLDMapView;
});