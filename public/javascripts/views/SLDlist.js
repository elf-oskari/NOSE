define([
	'lodash',
	'backbone',
	'jquery',
	'i18n!localization/nls/SLDlist',
	'text!templates/SLDlist.html',
    'models/sld_config',
    'bootstrap'
], function(_, Backbone, $, locale, SLDListTemplate, SLDconfigModel) {
	var SLDListView = Backbone.View.extend({
		el: '.container-main',
		template: _.template(SLDListTemplate),
		events: {
	        'click .btn.upload': 'upload',
            'click .btn.delete-template': 'deleteTemplate',
            'click .btn.new': 'newConfig',
            'click .btn.edit': 'editConfig',
            'click .btn.delete-config': 'deleteConfig',
            'click .btn.download': 'downloadConfig'

      	},
		initialize: function(params) {
            _.bindAll(this, 'render');
            this.configs = params.configs;
            this.templates = params.templates;
        },
        render: function() {
        	var localization = locale;
            var templateConfigTree = this.templates.getTemplateConfigTree(this.configs.getConfigTree());
            this.$el.html(this.template({_: _, SLDtemplates: templateConfigTree, SLDlist_i18n: localization}));
            return this;
        },
        deleteConfig: function () {
            event.preventDefault();
            $('#deleteConfigModal').modal('hide');
            alert('Deleting config is not possible');
        	//console.log(this.configs.models);
        	//this.configs.models.destroy({
          		//success: function () {
		            //console.log('destroyed');
		            //router.navigate('', {trigger:true});
          		//}
        	//});
        //return false;
      	},
        newConfig: function (event) {
            event.preventDefault();
            var template_id = $(event.currentTarget).data('template-id');
            var template = this.templates.get(template_id);
            var new_config_sld_values = template.getDefaultConfigSLDValues();
            var new_config = {
                "id": "new",
                "template_id": template_id,
                "sld_values": new_config_sld_values
            };
            this.configs.create(new_config);
            Backbone.history.navigate('/edit/new', true);
        },
        editConfig: function (event) {
            event.preventDefault();
            Backbone.history.navigate('/edit/' + $(event.currentTarget).data('config-id'), true);
        },
        downloadConfig: function (event) {
            event.preventDefault();
            // TODO: use url from collection instead.
            var apiUrl = "/api/v1/configs/";
            window.open(apiUrl + $(event.currentTarget).blur().data('config-id') + "/download");
            alert('Downloading config is not possible');
        },
        deleteTemplate: function () {
            event.preventDefault();
            $('#deleteTemplateModal').modal('hide');
            alert('Deleting template is not possible');
        },
        upload: function(event) {
            event.preventDefault();
            var fd = new FormData(document.getElementById("fileinfo"));
            fd.append("CustomField", "This is some extra data");
            $.ajax({
                url: "/api/v1/sld_upload",
                type: "POST",
                data: fd,
                cache: false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,   // tell jQuery not to set contentType
                success: function() {
                    alert('SLD Uploaded!');
                    console.log('form submitted.');
                    $('#uploadModal').modal('hide');
                }
            });
        }
    });
    return SLDListView;
});
