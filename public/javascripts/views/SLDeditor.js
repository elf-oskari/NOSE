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
      this.listenTo(this.dispatcher, "selectSymbolizer", this.updateEditParams);
      this.SLDconfigmodel = params.SLDconfigmodel;
      _.bindAll(this, 'render');
    },
    render: function() {
      var localization = locale;
      this.$el.html(this.template({SLDmodel: this.SLDconfigmodel, editSLD: localization, paramlist: false}));
      return this;
    },

    /**
     * @method updateEditParams
     * Updates SLDeditor view with editable params
     */
    updateEditParams: function(params) {
      this.paramlist = this.returnEditParams(params);
      this.$el.html(this.template({SLDmodel: this.SLDconfigmodel, paramlist: this.paramlist}));
    },

    /**
     * @method returnEditParams
     * Returns sld_values that match the given params
     * @return {Array} list of sld_values that are editable at this state
     */
    returnEditParams: function(params) {
      console.log('continue here');
      debugger;
      var paramlist = [];
      _.forEach(this.SLDconfigmodel.get('sld_values'), function(SLDvalue) {
        _.forEach(params, function(param) {
          if (SLDvalue.param_id === param.id) {
          paramlist.push(SLDvalue);
        }
        });
      });
      return paramlist;
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