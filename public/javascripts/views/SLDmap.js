define([
  'lodash',
  'backbone',
  'jquery',
  'ol3',
  'i18n!localization/nls/SLDlist'
], function(_, Backbone, $, ol, locale) {
  var SLDMapView = Backbone.View.extend({
    className: 'map',
    initialize: function() {
      _.bindAll(this, 'render');
    },
    render: function() {
      // create a map in the "map" div, set the view to a given place and zoom
      if (!this.map) {
        this.map = new ol.Map({
          target: this.el,
          layers: [
            new ol.layer.Tile({source: new ol.source.OSM()})
          ],
          view: new ol.View({
            center: [-17704.73, 6710951.33],
            zoom: 13
          })
        });
        window.debugMap = this.map;
      } else {
        // map node has been detached.
        // Note! event handling might not function properly, but since we currently do not have any map specific
        // event handling, this is not tested. Look at assign in SLDEditorPage for more details.
        this.$el.replaceWith(this.map.getTarget());
        // reset map view
        this.map.getView().setCenter([-17704.73, 6710951.33], 13);
      }
    }
  });
  return SLDMapView;
});