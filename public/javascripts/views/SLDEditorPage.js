// Renders the views in SLD editor page

define([
    'lodash',
    'backbone',
    'jquery',
    'bootstrap',
    'i18n!localization/nls/SLDeditor',
    'text!templates/SLDEditorPageTemplate.html',
    'models/sld_config',
    'models/sld_template',
    'views/SLDtree',
    'views/SLDeditor',
    'views/SLDmap'
], function(_, Backbone, $, Bootstrap, locale, editorTemplate, SLDtemplateModel, SLDconfigModel, SLDTreeView, SLDEditorView, SLDMapView) {
    var SLDEditorPageView = Backbone.View.extend({
        el: '.container-main',
        template: _.template(editorTemplate),
        initialize: function(params) {
            this.SLDtemplatemodel = new SLDtemplateModel(params.SLDtemplatemodel.toJSON());
            this.SLDconfigmodel = new SLDconfigModel(params.SLDconfigmodel.toJSON());

            this.SLDconfigmodel.on("change", function(model, name) {console.log("config model", model, name);});
            
            this.editorView = new SLDEditorView({'SLDconfigmodel': this.SLDconfigmodel});
            this.treeView = new SLDTreeView({'SLDconfigmodel': this.SLDconfigmodel, 'SLDtemplatemodel': this.SLDtemplatemodel});
            this.mapView = new SLDMapView();
            _.bindAll(this, 'render');
        },
        setModels: function(models) {
            this.SLDtemplatemodel.set(models.SLDtemplatemodel.toJSON());
            this.SLDconfigmodel.set(models.SLDconfigmodel.toJSON());
            return this;
        },
        render: function() {
            this.$el.html(this.template());
            this.assign(this.treeView, '.tree');
            this.assign(this.editorView, '.page');
            this.assign(this.mapView, '.map');
            return this;
        },
        /*
        * assign is basically just setElement, which calls delegateEvents for you.
        * But with a nicer API and an automatic call to render.
        * Based on http://ianstormtaylor.com/rendering-views-in-backbonejs-isnt-always-simple/
        */
        assign: function(view, selector) {
            view
                .setElement(this.$(selector))
                .render();
        }
    });
    return SLDEditorPageView;
});