 define([
  'collection'
  ])

  <div class="view" id="sld-list">
    <a href="/new" class="btn btn-primary">New</a>
    <hr />
    <table class="table striped">
      <thead>
        <tr>
          <th>SLD name</th><th>SLD parent</th><th></th>
        </tr>
      </thead>
      <tbody>
      <tbody>
        <% _.forEach(SLDTemplateCollection, function(SLDtemplateModel) { %>
          <tr>
            <td><%= htmlEncode(SLDtemplateModel.get('id')) %></td>
            <td><%= htmlEncode(SLDtemplateModel.get('name')) %></td>
            <td><a class="btn" href="#/edit/<%= user.id %>">Edit</a></td>
          </tr>
        <% }); %>
      </tbody>
      </tbody>
    </table>
  </div>

  define([
  'lodash',
  'backbone',
  'models/sld_template'
], function(_, Backbone, SLD_template) {
  var SLDTemplatesCollection = Backbone.Collection.extend({
    model: SLD_template,
    urlRoot: "/api/v1/",
    initialize: function(models) {
      if (_.isUndefined(models)) {
        this.fetch();
      }
    },
    getById: function(id) {
      return this.find(function(item) {
        return item.get('id') === id;
      });
    },
    comparator: function(item) {
      return item.get('id');
    }
  });

  return SLDTemplatesCollection;
});