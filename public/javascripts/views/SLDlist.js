define([
    'lodash',
    'backbone',
    'jquery',
    'i18n!localization/nls/SLDlist',
    'text!templates/SLDlist.html',
    'text!templates/SLDListButtons.html',
    'models/sld_config',
    'bootstrap'
], function(_, Backbone, $, locale, SLDListTemplate, SLDListButtons, SLDconfigModel) {
    var SLDListView = Backbone.View.extend({
        el: '.container-main',
        template: _.template(SLDListTemplate),
        userRole: null,
        events: {
            'click .btn.delete': 'deleteConfirmation',
            'click .btn.upload': 'upload',
            'click .btn.delete-template': 'deleteTemplate',
            'click .btn.new': 'newConfig',
            'click .btn.create-config': 'createNewConfig',
            'click .btn.edit': 'editConfig',
            'click .btn.delete-config': 'deleteConfig',
            'click .btn.download': 'downloadConfig',
            'click .list-group-item':'listGroupItemClick',
            'click .signout-list-page': 'logoutFromListView'

        },
        initialize: function(params) {
            _.bindAll(this, 'render');
            this.configs = params.configs;
            this.templates = params.templates;
        },
        render: function() {
            var localization = locale;
            this.userRole = $('#user').val();
            this.userName = $('#user').attr('name');
            var templateConfigTree = this.templates.getTemplateConfigTree(this.configs.getConfigTree());
            this.$el.html(this.template({_: _, SLDtemplates: templateConfigTree, SLDlist_i18n: localization, userName: this.userName, userrole: this.userRole}));
            var buttonOptions = {SLDModel: null, SLDConfigModel: null, SLDlist_i18n: locale, userrole: this.userRole};
            this.renderButtons(buttonOptions);
            return this;
        },
        renderButtons: function(options) {
            //Update the action buttons navbar according to the selection.
            $("#sld_buttons_navbar").html(_.template(SLDListButtons, options));
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
            var self = this,
                localization = locale
                name = $(event.currentTarget.offsetParent.children).find("#nameInput")[0].value;
            $('#createConfigModal').modal('hide');
            $('#creatingModal').modal('show');
            this.SLDconfigmodel.set('name', name);
            this.SLDconfigmodel.save({},{
                wait: true
            }).done(
                function (model, response, options) {
                    console.log("New config created. Model: ", model, "response: ", response, "options: ", options);
                    $('#creatingModal').modal('hide');
                    $('#informModal').on('show.bs.modal', function () {
                        var modal = $(this);
                        modal.find('.modal-title').text(locale.createConfig['informModalTitle']);
                        modal.find('.modal-body').text(locale.createConfig['informModalBody'] + model.name);
                    })
                    $('#okButton').on("click", function () {
                      $('#informModal').modal('hide');
                      Backbone.history.navigate('/edit/' + model.id, true);
                    });
                    $('#informModal').modal('show');
            }).fail(
                function (model, response, options) {
                    console.log('Error', model, response, options);
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
        showInfoModal: function (modalTitle, modalBody, response) {
            if ($('#savingModal')) {
                $('#savingModal').modal('hide');
            }
            $('#informUserModal').on('show.bs.modal', function () {
                var modal = $(this);
                modal.find('.modal-title').text(modalTitle);
                modal.find('.modal-body').text(modalBody)
            })
            $('#informUserModal').modal('show');
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
                },
                error: function(response) {
                    //TODO: handle error, notify user (401 for instance)
                    $('#uploadModal').modal('hide');

                }
            });
        },
        listGroupItemClick: function(event) {
            var element = $(event.currentTarget);
            var wasSelected = $(element).hasClass('list-group-item-selected');
            //Remove selection from the previously selected list item, if any
            $('.list-group-item-selected').removeClass('list-group-item-selected');
            

            var sldModel = null;
            var configModel = null;
            //Element wasn't selected before -> highlight it
            if (!wasSelected) {
                $(element).addClass('list-group-item-selected');

                //get the active sld or config
                if ($(element).hasClass('list-group-item-config')) {
                    configModel = this.configs.getById(element.data('id')); 
                } else {
                    //sld
                    sldModel = this.templates.getById(element.data('id'));
                }

            }

            var buttonOptions = {SLDModel: sldModel, SLDConfigModel: configModel, SLDlist_i18n: locale, userrole: this.userRole};
            this.renderButtons(buttonOptions);
        },

        logoutFromListView: function() {
            var url = window.location.href;
            //this removes the anchor at the end, if there is one
            url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
            //this removes the query after the file name, if there is one
            url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
            url = url.substr(0, url.lastIndexOf('/')) + "/logout";
            window.location.href = url;
        }
    });
    return SLDListView;
});
