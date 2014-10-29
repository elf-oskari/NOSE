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
], function(_, Backbone, $, Bootstrap, locale, editorTemplate, SLDconfigModel, SLDtemplateModel, SLDTreeView, SLDEditorView, SLDMapView) {
    var SLDEditorPageView = Backbone.View.extend({
        el: '.container-main',
        template: _.template(editorTemplate),
        events: {
            'click .btn.back': 'back'
        },
        initialize: function(params) {
            this.dispatcher = params.dispatcher;
            this.SLDtemplatemodel = params.SLDtemplatemodel;
            this.SLDconfigmodel = params.SLDconfigmodel;

            this.editorView = new SLDEditorView({'SLDconfigmodel': this.SLDconfigmodel, 'dispatcher': this.dispatcher});
            this.treeView = new SLDTreeView({'SLDconfigmodel': this.SLDconfigmodel, 'SLDtemplatemodel': this.SLDtemplatemodel, 'dispatcher': this.dispatcher});
            this.mapView = new SLDMapView({'dispatcher': this.dispatcher});
            _.bindAll(this, 'render');
        },
        back: function (event) {
            event.preventDefault();
            Backbone.history.navigate('/', true);
        },
        setModels: function(models) {
            this.SLDtemplatemodel = models.SLDtemplatemodel;
            this.SLDconfigmodel = models.SLDconfigmodel;
            // update model in subview
            this.editorView.setModel(models.SLDconfigmodel);
            this.treeView.setModels(models);
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