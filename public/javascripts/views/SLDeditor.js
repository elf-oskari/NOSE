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
          'change .name': 'setAttribute',
          'change .param': 'setParam'
    },
		initialize: function(params) {
      this.dispatcher = params.dispatcher;
      this.listenTo(this.dispatcher, "selectSymbolizer", this.updateEditParams);
      this.listenTo(this.dispatcher, "all", this.logger);
      this.setModel(params.SLDconfigmodel);
      _.bindAll(this, 'render');
    },
    logger: function() {
      console.log('listening to all events in SLDeditor model', arguments);
    },
    setModel: function(model) {
      var self = this;

      // we must stop listening first and then add to current model
      self.stopListening(self.SLDconfigmodel, "invalid");
      self.stopListening(self.SLDconfigmodel, "all");
      self.stopListening(self.SLDconfigmodel, "sync");
      self.SLDconfigmodel = model;
      self.listenTo(self.SLDconfigmodel, "invalid", self.invalidValue);
      self.listenTo(self.SLDconfigmodel, "all", self.logger);
      self.listenTo(self.SLDconfigmodel, "sync", function () { self.render();});
    },
    render: function(paramlist) {
      var localization = locale;
      var model = this.SLDconfigmodel.pick('id', 'name');
      var params = _.isUndefined(paramlist) ? false : paramlist;
      this.$el.html(this.template({SLDmodel: model, editSLD: localization, paramlist: params}));
      return this;
    },

    /**
     * @method updateEditParams
     * Updates SLDeditor view with editable params
     */
    updateEditParams: function(params) {
      console.log('updateEditParams', params);
      var paramlist = this.SLDconfigmodel.getSLDValuesByParams(params);
      this.render(paramlist);
    },

    setAttribute: function(event) {
      var element = $(event.currentTarget);
      var attribute = "" + element.data('attribute');
      var newvalue = element.val();

      this.SLDconfigmodel.set(attribute, newvalue);
    },
    setParam: function(event) {
      var element = $(event.currentTarget);
      var param_id = "" + element.data('param-id');
      var newvalue = element.val();

      var sld_values = this.SLDconfigmodel.get('sld_values');
      // we assume the changed param_id is always found
      var paramIndex = _.findIndex(sld_values, {'param_id': param_id});
      var param = sld_values[paramIndex];
      param.value = newvalue;

      this.SLDconfigmodel.set('sld_values', sld_values);
    },

    invalidValue: function(event) {
      console.log('got invalid', event, arguments);
    },

    saveConfig: function(event) {
      event.preventDefault();
      this.SLDconfigmodel.save({},{
        wait: true,
        error: function (model, response, options) {
          alert('something went wrong!');
          console.log('Error', model, response, options);
        }
      });
    },

    deleteConfig: function () {
      event.preventDefault();
      this.SLDconfigmodel.destroy({
        wait: true,
        success: function (model, response, options) {
          Backbone.history.navigate('', true);
        }, error: function (model, response, options) {
          console.log("something didn't go as planned", model, response, options);
          alert('Deleting template is not possible1234');
        }
      });
    }
	});

	return SLDEditorView;
});