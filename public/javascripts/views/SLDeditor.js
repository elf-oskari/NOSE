define([
	'lodash',
	'backbone',
	'jquery',
	'bootstrap',
	'i18n!localization/nls/SLDeditor',
	'text!templates/SLDeditor.html'
], function(_, Backbone, $, Bootstrap, locale, editSLDTemplate) {
	var SLDEditorView = Backbone.View.extend({
    className: 'page',
		template: _.template(editSLDTemplate),
		events: {
	        'click .delete': 'deleteConfig',
	        'click .upload': 'showUpload'
    },
		initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.SLDconfigmodel = params.SLDconfigmodel;
      _.bindAll(this, 'render');
    },
    render: function() {
      var localization = locale;
      this.$el.html(this.template({SLDmodel: this.SLDconfigmodel, editSLD: localization, SLDvalues: this.SLDconfigmodel.get('sld_values')}));
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