define(['lodash','backbone'], function(_, Backbone) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'' : 'listSLD',
			'edit/:id' : 'editSLD',
			'new' : 'editSLD'
		},

		initialize: function(WebApp) {
			console.log('WebApp', WebApp);
			this.WebApp = WebApp;
		},
		editSLD: function(id) {
			console.log('Router editSLD', id);
			var self = this;
			var editorPageView;
			var SLDconfigmodel = this.WebApp.collections.SLDConfigsCollection.getById(id);
			if (!this.WebApp.views.SLDEditorPage) {
				require(['views/SLDEditorPage'], function(SLDEditorPageView) {
					var editorPageView = new SLDEditorPageView({'SLDconfigmodel': SLDconfigmodel});
					editorPageView.on('remove', function(item) {
						console.log('remove event triggered with view', item);
						self.navigate('index', {trigger:true});
					});
					editorPageView.render();
					window.WebApp.views.SLDEditorPage = editorPageView;
				});
			} else {
				editorPageView = window.WebApp.views.SLDEditorPage;
				editorPageView.model = SLDconfigmodel;
				editorPageView.render();
			}
		},
		listSLD: function(url) {
			console.log('Router default', url);
			var view;
			var templates = this.WebApp.collections.SLDTemplatesCollection;
			var configs = this.WebApp.collections.SLDConfigsCollection;
			if (!this.WebApp.views.SLDlist) {
				require(['views/SLDlist'], function(SLDListView) {
					view = new SLDListView({'configs': configs, 'templates': templates});
					view.render();
					window.WebApp.views.SLDlist = view;
				});
			} else {
				view = window.WebApp.views.SLDlist;
				view.render();
			}
		}
	});
	return AppRouter;
});
