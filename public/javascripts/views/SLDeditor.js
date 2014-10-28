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
	        'click .upload': 'showUpload',
          'click .save': 'saveConfig',
          'change .name': 'setAttribute'
    },
		initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.updateEditParams);
      this.SLDconfigmodel = params.SLDconfigmodel;
      this.listenTo(this.SLDconfigmodel, "invalid", this.invalidValue);
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
      var sld_values = this.SLDconfigmodel.get('sld_values');
      var valueslist = _.map(params, function (param) {
        var newparam = _.findWhere(sld_values, {"param_id" : param.id});
        newparam.name = param.param_path;
        return newparam;
      });
      return valueslist;
    },

    setAttribute: function(event) {
      var element = $(event.currentTarget);
      var attribute = "" + element.data('attribute');
      var newvalue = element.val();

      this.SLDconfigmodel.set(attribute, newvalue);
      console.log('we got a name change!', event, this.SLDconfigmodel);
    },

    invalidValue: function(event) {
      console.log('got invalid', event, arguments);
    },

    saveConfig: function(event) {
      event.preventDefault();
      console.log('saving model', this.SLDconfigmodel.isNew());
      var self = this;
      this.SLDconfigmodel.save({},{
        wait: true,
        success: function (model, response, options) {
          console.log('created');
          self.dispatcher.trigger("createConfig", model);
        }, error: function (model, response, options) {
          alert('something went wrong!');
          console.log('Error', model, response, options);
        }
      });
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