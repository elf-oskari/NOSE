define(['lodash','backbone'], function(_, Backbone) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'application.html' : 'listSLD',
			'/' : 'listSLD',
			'edit/:id' : 'editSLD',
			'new/:id' : 'newSLD',
			'*default' : 'listSLD'
		},

		initialize: function(WebApp) {
			console.log('WebApp', WebApp);
			this.WebApp = WebApp;
		},
		editorPage: function(SLDtemplatemodel, SLDconfigmodel) {
			var self = this;
			var editorPageView;

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
		newSLD: function(template_id) {
			var self = this;
			var SLDtemplatemodel = self.WebApp.collections.SLDTemplatesCollection.getById(template_id);
            var new_config_sld_values = SLDtemplatemodel.getDefaultConfigSLDValues();
            var new_config = {
                "template_id": template_id,
                "sld_values": new_config_sld_values
            };
            var SLDconfigmodel = self.WebApp.collections.SLDConfigsCollection.create(new_config);
            self.editorPage(SLDtemplatemodel, SLDconfigmodel);
		},
		editSLD: function(id) {
			var self = this;
			var SLDconfigmodel = self.WebApp.collections.SLDConfigsCollection.getById(id);
			var SLDtemplatemodel = self.WebApp.collections.SLDTemplatesCollection.getById(SLDconfigmodel.get('template_id'));
            self.editorPage(SLDtemplatemodel, SLDconfigmodel);
		},
		listSLD: function(url) {
			var self = this;
			var view;
			var templates = self.WebApp.collections.SLDTemplatesCollection;
			var configs = self.WebApp.collections.SLDConfigsCollection;
			if (!self.WebApp.views.SLDlist) {
				require(['views/SLDlist'], function(SLDListView) {
					view = new SLDListView({'configs': configs, 'templates': templates, 'dispatcher': self.WebApp.dispatcher});
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
