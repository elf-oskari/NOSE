/** @fileoverview
 *  This tool generates an SLD file from PostgreSQL database.
 */

var fs = require('fs');
var pg = require('pg.js');
var Promise = require('es6-promise').Promise;

/** @constructor
 * Deferred encapsulates a promise that gets fulfilled by outside code. */
var Deferred = function () {
    var self = this;

    this.promise = new Promise(function (resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
    });
};

/** Return a new function that calls fn making it see the desired scope
 * through its "this" variable.
 * @param {Object} scope Variable fn should see as "this".
 * @param {function()} fn Function to call. */
function bindToScope(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

/** @constructor
 * PostgreSQL database interface.
 * Simple wrapper to use promises with pg.js. */
var PgDatabase = function () {
    this.client = null;
};

/** @param {Object} client:
 * host, port, database, user and password. */
PgDatabase.prototype.connect = function (client) {
    var defer = new Deferred();

    this.client = client;
    defer.resolve();
    return (defer.promise);
};

/** Execute query without reading any results. */
PgDatabase.prototype.exec = function () {
    var query = this.client.query.apply(this.client, arguments);
    var defer = new Deferred();

    query.on('error', function (err) {
        defer.reject(err);
    });

    query.on('end', function (state) {
        defer.resolve(state);
    });

    return (defer.promise);
};

/** Send query to database and read a single result row. */
PgDatabase.prototype.queryResult = function () {
    var query = this.client.query.apply(this.client, arguments);
    var defer = new Deferred();
    var result = [];

    query.on('row', function (row) {
        result.push(row);
    });

    query.on('error', function (err) {
        defer.reject(err);
    });

    query.on('end', function (state) {
        if (!result) return (defer.reject('Not found'));
        defer.resolve(result);
    });

    return (defer.promise);
};

PgDatabase.prototype.begin = function () {
    return (this.exec('BEGIN TRANSACTION'));
};

PgDatabase.prototype.commit = function () {
    return (this.exec('COMMIT'));
};

PgDatabase.prototype.rollback = function () {
    return (this.exec('ROLLBACK'));
};

/** @constructor
 * SldDownloader executes slq select to
 *  an SQL database. */
var SldDownloader = function () {
    this.db = null;
    this.data = [];
};

/** @param {string} client Name of JSON file with database address and credentials. */
SldDownloader.prototype.connect = function (client) {
    var defer = new Deferred();

    this.db = new PgDatabase();

    return (this.db.connect(client));
};
/**
 * Read parameter values from database
 * @param id config id
 * @returns {Promise}
 */
SldDownloader.prototype.readValues = function (id) {
    var self = this,
        sql = 'SELECT param_id, value FROM sld_value WHERE config_id=' + id;
    return (self.db.queryResult(sql));
};

/**
 * Read rule values from database
 * @param id config id
 * @returns {Promise}
 */
SldDownloader.prototype.readRules = function (id) {
    var self = this,
        sql = 'SELECT name, title, abstract, minscaledenominator, maxscaledenominator, template_offset FROM sld_rule WHERE config_id=' + id;
    return (self.db.queryResult(sql));
};

/**
 * Read parameter offset from database
 * @param id parameter id
 * @returns {Promise}
 */
SldDownloader.prototype.readOffset = function (id) {
    var self = this,
        sql = 'SELECT template_offset FROM sld_param WHERE id=' + id;
    return (self.db.queryResult(sql));
};

/**
 * Read template id from database
 * @param id config id
 * @returns {Promise}
 */
SldDownloader.prototype.readTemplateId = function (id) {
    var self = this,
        sql = 'SELECT template_id FROM sld_config WHERE id=' + id;
    return (self.db.queryResult(sql));
};

/**
 * Read template from database
 * @param id template id
 * @returns {Promise}
 */
SldDownloader.prototype.readTemplate = function (id) {
    var self = this,
        sql = 'SELECT content FROM sld_template WHERE id=' + id;
    return (self.db.queryResult(sql));
};

/**
 * Generate an SLD file
 * @param template SLD template
 * @returns {string} SDL file contents
 */
SldDownloader.prototype.generateSld = function (template) {
    var self = this,
        pos,
        value,
        output = template.slice(0),
        data = self.data,
        offset = 0,
        i;

    // Sort the array by position index
    data.sort(function (a, b) {
        return a[0] - b[0];
    });

    // Make the template substitutions
    for (i = 0; i < data.length; i++) {
        pos = data[i][0] + offset;
        value = data[i][1];
        output = output.substr(0, pos) + value + output.substr(pos + 1);
        offset = offset + value.length - 1;
    }
    return (output);
};

/** Roll back current transaction and close connection. */
SldDownloader.prototype.abort = function () {
    return (this.db.rollback()); //.then(bindToScope(this.db,this.db.close)));
};

/** Commit current transaction and close connection. */
SldDownloader.prototype.finish = function () {
    return (this.db.commit()); //.then(bindToScope(this.db,this.db.close)));
};

/** Top function, to execute sql statement
 * @param {String} sql_template id
 * */
exports.download_config = function (id, client, cb) {

    console.log("in download_config");
    console.log("id: " + id);

    var downloader = new SldDownloader(),
        callback = cb;

    var connected = downloader.connect(client);

    // Read parameter values based on the config id
    var valuesRead = connected.then(function () {
        return (downloader.readValues(id));
    });

    // Read parameter offsets based on the parameter ids
    var paramsGenerated = valuesRead.then(function (values) {
        var self = this;
        values.forEach(function (value) {
            var offsetRead = downloader.readOffset(value.param_id);
            offsetRead.then(function (offset) {
                downloader.data.push([offset[0].template_offset, value.value]);
            });
        });
    });

    // Read template id based on the config id
    var templateIdRead = paramsGenerated.then(function () {
        return (downloader.readTemplateId(id));
    });

    // Read template based on the template id
    var templateRead = templateIdRead.then(function (templateId) {
        return (downloader.readTemplate(templateId[0].template_id));
    });

    var ruleTags = {
        'name':'Name',
        'title':'Title',
        'abstract':'Abstract',
        'minscaledenominator':'MinScaleDenominator',
        'maxscaledenominator':'MaxScaleDenominator'
    };
    var calculateOffsetsForRuleTags = function(rule, template) {
        //only search for tags inside this particular rule
        var ruleStartOffset = rule.template_offset;
        //regex for rule ending tag (with or without namespace)
        var ruleEndRegex = /(<\/)(.)*rule>/i;
        var ruleEndOffset = template.substr(ruleStartOffset, template.length).toLowerCase().search(ruleEndRegex);
        var ruleSubstring = null;
        
        if (ruleEndOffset > -1) {
            ruleEndOffset = parseInt(ruleStartOffset) + parseInt(ruleEndOffset);
            ruleSubstring = template.substr(ruleStartOffset, ruleEndOffset - ruleStartOffset);
            if (ruleSubstring) {
                for (var key in ruleTags) {
                    if (rule.hasOwnProperty(key)) {
                        var tagOffset = calculateOffsetForTag(ruleSubstring, ruleTags[key]);
                        if (tagOffset > -1) {
                            downloader.data.push([parseInt(ruleStartOffset)+parseInt(tagOffset) - 1, rule[key]]);
                        } 
                    }
                }
            }
        }
        return;
    };
    calculateOffsetForTag = function(ruleTemplate, tagName) {
        //with or without namespace and ending to the placeholder
        var tagStartRegexString = '(<)(.)*'+tagName.toLowerCase()+'(.)[$]';
        var tagStartRegex = new RegExp(tagStartRegexString, 'i');
        var tagOffset = ruleTemplate.toLowerCase().search(tagStartRegex);
        var startTagFullName = ruleTemplate.match(tagStartRegex);

        if (tagOffset > -1) {
            return tagOffset + startTagFullName[0].length;
        }
        return tagOffset;

    };

    var templateGlobal = null;
    var rulesRead = templateRead.then(function (template) {
        templateGlobal = template;
        return (downloader.readRules(id));
    });

    var rulesReadThen = rulesRead.then(function(rules) {
        return (rules.forEach(function(rule) {
            return calculateOffsetsForRuleTags(rule, templateGlobal[0].content);
        }));
    });

    // Generate an SLD file
    var ready = rulesReadThen.then(function () {
        return (downloader.generateSld(templateGlobal[0].content));
    });

    ready.catch(function (err) {
        console.error(err);
    });

    ready.then(function (readyResult) {
        console.log('Download success!');
        callback(false, readyResult);
    });
};

