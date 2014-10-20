// Renders the views in SLD editor page

define([
    'lodash',
    'backbone',
    'jquery',
    'bootstrap',
    'i18n!localization/nls/SLDeditor',
    'text!templates/SLDEditorPageTemplate.html',
    'views/SLDtree',
    'views/SLDeditor',
    'views/SLDmap'
], function(_, Backbone, $, Bootstrap, locale, editorTemplate, SLDTreeView, SLDEditorView, SLDMapView) {
    var SLDEditorPageView = Backbone.View.extend({
        el: $('div.container-main'),
        template: _.template(editorTemplate),
        initialize: function(params) {
            this.SLDtemplatemodel = params.SLDtemplatemodel;
            this.SLDconfigmodel = params.SLDconfigmodel;
            this.SLDconfigmodel.on('change', function(event) {console.log(event)});
            console.log('initialize', params);
            
            this.editorView = new SLDEditorView({'SLDconfigmodel': this.SLDconfigmodel});
            this.treeView = new SLDTreeView({'SLDconfigmodel': this.SLDconfigmodel, 'SLDtemplatemodel': this.SLDtemplatemodel});
            this.mapView = new SLDMapView();
            _.bindAll(this, 'render');
        },
        setModels: function(models) {
            console.log('changing model');
            this.SLDtemplatemodel.set(models.SLDtemplatemodel.toJSON);
            this.SLDconfigmodel.set(models.SLDconfigmodel.toJSON);
            console.log('model changed');
        },
        render: function() {
            $(this.el).html(this.template());
            this.treeView.render(this.template);
            this.editorView.render();
            this.mapView.render(this.template);
            return this;
        }
    });
    return SLDEditorPageView;
});