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
                    console.log("something didn't go as planned", model, response, options);
                    alert('Deleting template is not possible');
                    $('#deleteConfigModal').modal('hide');
                },
            });
        },
        newConfig: function (event) {
            event.preventDefault();
            var template_id = $(event.currentTarget).data('id');
            Backbone.history.navigate('/new/' + template_id, true);
        },
        editConfig: function (event) {
            event.preventDefault();
            Backbone.history.navigate('/edit/' + $(event.currentTarget).data('id'), true);
        },
        downloadConfig: function (event) {
            event.preventDefault();
            // TODO: use url from collection instead.
            var apiUrl = "/api/v1/configs/";
            window.open(apiUrl + $(event.currentTarget).blur().data('id') + "/download");
            alert('Downloading config is not possible');
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
                },
            });
        },
        upload: function(event) {
            event.preventDefault();
            var self = this;
            var fd = new FormData(document.getElementById("fileinfo"));
            fd.append("CustomField", "This is some extra data");
            $.ajax({
                url: "/api/v1/templates/",
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
