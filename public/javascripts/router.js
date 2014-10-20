define(['lodash','backbone'], function(_, Backbone) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'' : 'listSLD',
			'/' : 'listSLD',
			'edit/:id' : 'editSLD',
			'new' : 'editSLD'
		},

		initialize: function(WebApp) {
			console.log('WebApp', WebApp);
			this.WebApp = WebApp;
		},
		editSLD: function(id) {
			var self = this;
			var editorPageView;
			var SLDconfigmodel = self.WebApp.collections.SLDConfigsCollection.getById(id);
			var SLDtemplatemodel = self.WebApp.collections.SLDTemplatesCollection.getById(SLDconfigmodel.get('template_id'));
			if (!self.WebApp.views.SLDEditorPage) {
				require(['views/SLDEditorPage'], function(SLDEditorPageView) {
					editorPageView = new SLDEditorPageView({'SLDconfigmodel': SLDconfigmodel, 'SLDtemplatemodel': SLDtemplatemodel});
					editorPageView
						.setModels({'SLDconfigmodel': SLDconfigmodel, 'SLDtemplatemodel': SLDtemplatemodel})
						.render();
					self.WebApp.views.SLDEditorPage = editorPageView;
				});
			} else {
				editorPageView = self.WebApp.views.SLDEditorPage;
				editorPageView
					.setModels({'SLDconfigmodel': SLDconfigmodel, 'SLDtemplatemodel': SLDtemplatemodel})
					.render();
			}
		},
		listSLD: function(url) {
			var self = this;
			var view;
			var templates = this.WebApp.collections.SLDTemplatesCollection;
			var configs = this.WebApp.collections.SLDConfigsCollection;
			if (!self.WebApp.views.SLDlist) {
				require(['views/SLDlist'], function(SLDListView) {
					view = new SLDListView({'configs': configs, 'templates': templates});
					view.render();
					self.WebApp.views.SLDlist = view;
				});
			} else {
				view = self.WebApp.views.SLDlist;
				view.render();
			}
		}
	});
	return AppRouter;
});
