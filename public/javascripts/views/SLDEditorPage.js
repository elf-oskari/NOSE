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
        el: $('div.container-main'),
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
            $(this.el).html(this.template());
            this.treeView.render(this.template);
            this.editorView.render();
            this.mapView.render(this.template);
            return this;
        }
    });
    return SLDEditorPageView;
});