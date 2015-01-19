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
            'click .btn.delete': 'deleteConfirmation',
            'click .btn.upload': 'upload',
            'click .btn.delete-template': 'deleteTemplate',
            'click .btn.new': 'newConfig',
            'click .btn.create-config': 'createNewConfig',
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
        newConfig: function (event) {
            var element = $(event.currentTarget);
            var target = element.data('target');
            var template_id = element.data('id');
            var SLDtemplatemodel = this.templates.getById(template_id);
            var new_config_sld_values = SLDtemplatemodel.getDefaultConfigSLDValues();
            var new_config = {
                "template_id": template_id,
                "sld_values": new_config_sld_values
            };
            this.SLDconfigmodel = this.configs.create(new_config);
            this.SLDconfigmodel;
            $(target).attr('data-id', template_id).modal();
        },
        createNewConfig: function (event) {
            event.preventDefault();
            var self = this;
            var name = $(event.currentTarget.offsetParent.children).find("#nameInput")[0].value;
            this.SLDconfigmodel.set('name', name);
            this.SLDconfigmodel.save({},{
                wait: true,
                success: function (model, response, options) {
                    $('#createConfigModal').modal('hide');
                    self.render();
                },
                error: function (model, response, options) {
                    alert('something went wrong!');
                    console.log('Error', model, response, options);
                }
            });
        },

        deleteConfirmation: function (event) {
            var element = $(event.currentTarget);
            var target = element.data('target');
            var id = element.data('id');
            $(target).attr('data-id', id).modal();
        },

        deleteConfig: function (event) {
            event.preventDefault();
            var self = this;
            var config_id = $(event.currentTarget).closest('.modal').data('id');
            var config = this.configs.get(config_id);
            config.destroy({
                wait: true,
                success: function (model, response, options) {
                    $('#deleteConfigModal').modal('hide');
                    self.render();
                },
                error: function (model, response, options) {
                    console.log("RAMI learns jep jep! something didn't go as planned", model, response, options);
                    $('#errorrrr').show();
                    //alert(response.responseJSON["delete config"]);
                    //$('#deleteConfigModal').modal('hide');
                    $('#deleteConfigModal').modal('show');
                },
            });
        },

        editConfig: function (event) {
            event.preventDefault();
            Backbone.history.navigate('/edit/' + $(event.currentTarget).data('id'), true);
        },
        downloadConfig: function (event) {
            event.preventDefault();
            var apiUrl = "./api/v1/configs/";
            window.open(apiUrl + $(event.currentTarget).data('id') + "/download");
        },
        deleteTemplate: function (event) {
            event.preventDefault();
            var self = this;
            var template_id = $(event.currentTarget).closest('.modal').data('id');
            var template = this.templates.get(template_id);
            template.destroy({
                wait: true,
                success: function (model, response, options) {
                    console.log("everything went as planned", model, response, options);
                    $('#deleteTemplateModal').modal('hide');
                    self.render();
                },
                error: function (model, response, options) {
                    console.log("something didn't go as planned", model, response, options);
                    alert('Deleting template is not possible');
                    $('#deleteTemplateModal').modal('hide');
                }
            });
        },
        upload: function(event) {
            event.preventDefault();
            var self = this;
            var fd = new FormData(document.getElementById("fileinfo"));
            fd.append("CustomField", "This is some extra data");
            $.ajax({
                url: "./api/v1/templates/",
                type: "POST",
                data: fd,
                cache: false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,   // tell jQuery not to set contentType
                success: function(newTemplate) {
                    $('#uploadModal').modal('hide');
                    self.templates.create(newTemplate);
                    self.render();
                }
            });
        }
    });
    return SLDListView;
});
