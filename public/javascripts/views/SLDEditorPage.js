// Renders the views in SLD editor page

define([
	'lodash',
	'backbone',
	'jquery',
	'bootstrap',
	'i18n!localization/nls/editSLD',
	'text!templates/SLDEditorPageTemplate.html',
	'views/SLDtree',
	'views/SLDeditor',
	'views/SLDmap'
], function(_, Backbone, $, Bootstrap, locale, editorTemplate, SLDTreeView, SLDEditorView, SLDMapView) {
	var SLDEditorPageView = Backbone.View.extend({
		el: '.container-main',
		template: _.template(editorTemplate),
		initialize: function(params) {
			this.SLDconfigmodel = params.SLDconfigmodel;
			console.log('initialize', params);
            _.bindAll(this, 'render');
        },

	    render: function() {
	    	$(this.el).html(this.template());
	    	var localization = locale,
		    	editorView = new SLDEditorView({'SLDconfigmodel': this.SLDconfigmodel}),
				treeView = new SLDTreeView({'SLDconfigmodel': this.SLDconfigmodel}),
				mapView = new SLDMapView();
			editorView.render();
			mapView.render(this.template);
			treeView.render(this.template);
			return this;
	    }
	});
	return SLDEditorPageView;
});

//render 3 views:
/*
			if (!this.WebApp.views.SLDeditor) {
				require(['views/SLDeditor'], function(SLDEditorView) {
					editorView = new SLDEditorView({'model': model});
					editorView.on('remove', function(item) {
						console.log('remove event triggered with view', item);
						self.navigate('index', {trigger:true});
					});
					editorView.render();
					window.WebApp.views.SLDeditor = editorView;
				});
			} else {
				editorView = window.WebApp.views.SLDeditor;
				editorView.model = model;
				editorView.render();
			};
			if (!this.WebApp.views.SLDpreview) {
				require(['views/SLDpreview'], function(SLDMapView) {
					mapView = new SLDMapView();
					mapView.render();
					window.WebApp.views.SLDpreview = mapView;
				});
			} else {
				mapView = window.WebApp.views.SLDpreview;
				mapView.render();
			};
			if (!this.WebApp.views.SLDtree) {
				require(['views/SLDtree'], function(SLDTreeView) {
					treeView = new SLDTreeView();
					treeView.render();
					window.WebApp.views.SLDtree = treeView;
				});
			} else {
				treeView = window.WebApp.views.SLDtree;
				treeView.render();
			}
*/