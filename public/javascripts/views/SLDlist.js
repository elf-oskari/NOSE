define([
    'lodash',
    'backbone',
    'jquery',
    'i18n!localization/nls/SLDlist',
    'text!templates/SLDlist.html',
    'text!templates/SLDListButtons.html',
    'models/sld_config',
    'views/SLDeditor',
    'bootstrap'
], function(_, Backbone, $, locale, SLDListTemplate, SLDListButtons, SLDconfigModel, SLDeditor) {
    var SLDListView = Backbone.View.extend({
        el: '.container-main',
        template: _.template(SLDListTemplate),
        userRole: null,
        events: {
            'click .delete': 'deleteConfirmation',
            'click .btn.upload': 'upload',
            'click .btn.delete-template': 'deleteTemplate',
            'click .fa-plus-circle': 'newConfig',
            'click .btn.create-config': 'createNewConfig',
            'click .edit': 'editConfig',
            'click .btn.delete-config': 'deleteConfig',
            'click .download': 'downloadConfig',
            'click .signout-list-page': 'logoutFromListView',
            'click .collapse-panel': 'panelClicked',
            'change .chosen-select': 'updateSLDList'

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
            var element = event.currentTarget;
            var target = element.dataset.target;
            var template_id = element.dataset.id;
            $(target).attr('data-id', template_id).modal();
        },
        createNewSLDConfigModel: function(name, template_id, succesCallback, errorCallback) {
            var SLDtemplatemodel = this.templates.getById(template_id);
            var new_config_sld_values = SLDtemplatemodel.getDefaultConfigSLDValues();
            var new_config = {
                "template_id": template_id,
                "sld_values": new_config_sld_values,
                "name": name
            };
            this.SLDconfigmodel = this.configs.create(new_config, {"wait": true, success: succesCallback, error: errorCallback});
            Backbone.Validation.bind(this, {
              model: this.SLDconfigmodel,
              attributes: ['name']
            });
            this.stopListening(this.SLDconfigmodel, "validated:invalid");
            this.listenTo(this.SLDconfigmodel, "validated:invalid", this.invalidValue);

        },
        createNewConfig: function (event) {
            event.preventDefault();
            var self = this,
                modalTitle,
                modalBody,
                localization = locale
                name = $(event.currentTarget.offsetParent.children).find("#nameInput")[0].value;

            var template_id = $('#createConfigModal')[0].dataset.id;
            $('#createConfigModal').modal('hide');
            modalTitle = localization.createConfig['creatingConfig'];
            modalBody = undefined;
            hasSpinner = true;
            self.showInfoModal(modalTitle, modalBody, hasSpinner);
            
            var isValid = name && name.length;//this.SLDconfigmodel.isValid('name');
            if (isValid = true) {
                this.createNewSLDConfigModel(name, template_id,
                    function (model, response, options) {
                            console.log("New config created. Model: ", model, "response: ", response, "options: ", options);
                            modalTitle = locale.createConfig['creatingConfigSuccessTitle'],
                            modalBody = locale.createConfig['creatingConfigSuccessBody'] + response.name,
                            hasSpinner = false,
                            goToEditor = false,
                            self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor, model);
                    },
                    function (model, response, options) {
                        console.log('Error', model, response, options);
                        modalTitle = locale.createConfig['creatingConfigFailureTitle'],
                        modalBody = locale.createConfig['creatingConfigFailureBody'] + name,
                        hasSpinner = false,
                        goToEditor = false,
                        self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor, model);
                    });
            }
        },

        //TODO
        //Check this function that it works correctly
        invalidValue: function(view, attr, error, selector) {
            var self = this,
                localization = locale,
                modalTitle = localization.createConfig['invalidConfig'],
                modalBody = attr.name,
                hasSpinner = false,
                goToEditor = false;
            self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor);
        },

        deleteConfirmation: function (event) {
            var element = $(event.currentTarget);
            var target = element.data('target');
            var id = element.data('id');
            $(target).attr('data-id', id).modal();
        },

        deleteConfig: function (event) {
            event.preventDefault();
            $('#deleteConfigModal').modal('hide');
            var self = this;
            var config_id = $(event.currentTarget).closest('.modal').data('id');
            var config = this.configs.get(config_id);
            self.configName = config.attributes.name;
            modalTitle = locale.deleteConfig['deletingConfig'];
            modalBody = undefined;
            hasSpinner = true;
            self.showInfoModal(modalTitle, modalBody, hasSpinner);
            config.destroy({
                wait: true
            }).done(
                function (model, response, options) {
                    console.log("Config deleted. Model: ", model, "response: ", response, "options: ", options);
                    modalTitle = locale.deleteConfig['deletingConfigSuccessTitle'];
                    modalBody = locale.deleteConfig['deletingConfigSuccessBody'] + self.configName;
                    hasSpinner = false;
                    goToEditor = false;
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor, model);
            }).fail(
                function (model, response, options) {
                    console.log("Deleting config failed", model, response, options);
                    modalTitle = locale.deleteConfig['deletingConfigFailureTitle'],
                    modalBody = locale.deleteConfig['deletingConfigFailureBody'] + self.configName,
                    hasSpinner = false,
                    goToEditor = false,
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor, model);
            });
        },

        showInfoModal: function (modalTitle, modalBody, hasSpinner, goToEditor, model) {
            var self = this,
                informModal = $('#informModal'),
                okButton = informModal.find('#okButton');
            informModal.modal('hide');
            if (hasSpinner === true) {
                $('.fa-spin').removeClass('hidden');
                okButton.addClass('hidden');
            } else {
                if (okButton.hasClass('hidden')) {
                    okButton.removeClass('hidden')
                }
                if ($('.fa-spin').not(":hidden")) {
                    $('.fa-spin').addClass('hidden');
                }
            }
            informModal.on('show.bs.modal', function () {
                var modal = $(this);
                modal.find('.modal-title').text(modalTitle);
                if (modalBody) {
                    modal.find('.modal-body').text(modalBody);
                }
                okButton.on("click", function () {
                    informModal.modal('hide');
                    self.render();
                    //TODO! remove self.render to render the list only when it's changes f.e. config or template is deleted
                    if (_.has(model, 'id')) {
                        var element = $('.list-group').find("[data-id='" + model.id +"']");
                        element.parent().parent().collapse('show');
                    }
                });
            })
            informModal.modal({'keyboard': false});
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
            $('#deleteTemplateModal').modal('hide');
            var self = this;
            var template_id = $(event.currentTarget).closest('.modal').data('id');
            var template = this.templates.get(template_id);
            self.templateName = template.attributes.name;
            modalTitle = locale.deleteTemplate['deletingTemplate'];
            modalBody = undefined;
            hasSpinner = true;
            self.showInfoModal(modalTitle, modalBody, hasSpinner);
            template.destroy({
                wait: true
            }).done(
                function (model, response, options) {
                    console.log("Template deleted. Model: ", model, "response: ", response, "options: ", options);
                    modalTitle = locale.deleteTemplate['deletingTemplateSuccessTitle'];
                    modalBody = locale.deleteTemplate['deletingTemplateSuccessBody'] + self.templateName;
                    hasSpinner = false;
                    goToEditor = false;
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor);
            }).fail(
                function (model, response, options) {
                    console.log("Deleting template failed", model, response, options);
                    modalTitle = locale.deleteTemplate['deletingTemplateFailureTitle'],
                    modalBody = locale.deleteTemplate['deletingTemplateFailureBody'] + self.templateName,
                    hasSpinner = false,
                    goToEditor = false,
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor);
            });
        },
        upload: function(event) {
            event.preventDefault();
            $('#uploadModal').modal('hide');
            var self = this;
            var fd = new FormData(document.getElementById("fileinfo"));
            fd.append("CustomField", "This is some extra data");
            modalTitle = locale.upload['uploadingSLD'];
            modalBody = undefined;
            hasSpinner = true;
            self.showInfoModal(modalTitle, modalBody, hasSpinner);

            $.ajax({
                url: "./api/v1/templates/",
                type: "POST",
                data: fd,
                cache: false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,   // tell jQuery not to set contentType
                success: function(newTemplate, response, options) {
                    console.log("Uploaded SLD. Response: ", response, "options: ", options);
                    modalTitle = locale.upload['uploadSuccessTitle'];
                    modalBody = locale.upload['uploadSuccessBody'] + newTemplate.name;
                    hasSpinner = false;
                    goToEditor = false;
                    //don't call create, we've already saved 
//                    self.templates.create(newTemplate);
                    self.templates.add(newTemplate);
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor, newTemplate);
                },
                error: function(newTemplate, response, options) {
                    console.log("Uploading SLD failed", response, options);
                    modalTitle = locale.upload['uploadFailureTitle'],
                    modalBody = locale.upload['uploadFailureBody'],
                    hasSpinner = false,
                    goToEditor = false,
                    self.showInfoModal(modalTitle, modalBody, hasSpinner, goToEditor);
                }
            });
        },

        logoutFromListView: function() {
            var url = window.location.href;
            //this removes the anchor at the end, if there is one
            url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
            //this removes the query after the file name, if there is one
            url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
            url = url.substr(0, url.lastIndexOf('/')) + "/logout";
            window.location.href = url;
        },

        panelClicked: function(event) {
          var arrowelement = $(event.currentTarget).find('.pull-left')[0];
          if (arrowelement) {
              this.panelClickedHandler(arrowelement);
          }
        },

        panelClickedHandler: function(arrowelement) {
          if ($(arrowelement).hasClass("fa-caret-right")) {
            arrowelement.setAttribute("class", "fa fa-caret-down pull-left");
          } else {
            arrowelement.setAttribute("class", "fa fa-caret-right pull-left");
          }
        },

        updateSLDList: function(event) {
          var me = this;
          
          var template_id = event.target.value;
          me.collapsePanel(template_id);
          
        },

        collapsePanel: function (template_id) {
          var   me = this,
                panel = $('#SLDtemplate-id-' + template_id);
          panel.collapse('show');
          var arrowelement = $(panel.parent()).find('.pull-left')[0];
          me.panelClickedHandler(arrowelement);
          var offsetTop = $(panel)[0].offsetTop;
          $(".panel-body.container-panel").scrollTop(offsetTop);
        }
    });
    return SLDListView;
});
