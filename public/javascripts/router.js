define(['lodash','backbone'], function(_, Backbone) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'application.html' : 'listSLD',
			'/' : 'listSLD',
			'edit/:id' : 'editSLD',
			'new' : 'editSLD',
			'*default': 'listSLD'

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
					editorPageView = new SLDEditorPageView({'SLDconfigmodel': SLDconfigmodel, 'SLDtemplatemodel': SLDtemplatemodel, 'dispatcher': self.WebApp.dispatcher});
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
			var SLDtemplatemodels = self.WebApp.collections.SLDTemplatesCollection.models;
			var SLDconfigmodels = self.WebApp.collections.SLDConfigsCollection.models;
			if (!self.WebApp.views.SLDlist) {
				require(['views/SLDlist'], function(SLDListView) {
					view = new SLDListView({'SLDconfigmodels': SLDconfigmodels, 'SLDtemplatemodels': SLDtemplatemodels, 'dispatcher': self.WebApp.dispatcher});
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
