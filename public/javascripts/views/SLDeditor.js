define([
	'lodash',
	'backbone',
	'jquery',
	'bootstrap',
	'i18n!localization/nls/editSLD',
	'text!templates/editSLD.html',
	'models/sld_config'
], function(_, Backbone, $, Bootstrap, locale, editSLDTemplate, SLDconfigModel) {
	var SLDEditorView = Backbone.View.extend({
    el : '.page',
		template: _.template(editSLDTemplate),
		events: {
	        'click .delete': 'deleteConfig',
	        'click .upload': 'showUpload'
    },
		initialize: function(params) {
      this.SLDconfigmodel = params.SLDconfigmodel;
      _.bindAll(this, 'render');
      console.log(this, arguments);
      console.log('AuthorView Initialized!', this.collection);
    },
    render: function() {
      var localization = locale;
      $(this.el).html(this.template({SLDmodel: this.SLDconfigmodel, editSLD: localization, SLDvalues: this.SLDconfigmodel.get('sld_values')}));
      return this;
    },
    deleteConfig: function () {
      console.log(this.configs.models);
      this.configs.models.destroy({
      success: function () {
		    console.log('destroyed');
		    router.navigate('', {trigger:true});
      }
      });
      return false;
    },
	});
	return SLDEditorView;
});