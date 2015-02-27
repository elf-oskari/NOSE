# SLD-Editor

SLD-Editor is a Node.js based web application for editing SLD-files easily and visually. User can import own SLD-files, create new configurations based on imported SLD-files, edit configurations visually with SLD-editor and download the edited configurations as SLD-files.

## Requirements

* [Node.js](http://nodejs.org/download/)
* [PostgreSQL](http://www.postgresql.org/) 

## Install

1. Download source code from [GitHub](https://github.com/elf-oskari/NOSE)
2. Install dependencies
`npm install` 

## Configure

Database connection should be configured to file `db.json`. By default `db.json` looks like this:

	{
		"host":"database-server.example.invalid",
		"port":5432,
		"database":"sld_styles",
		"user":"root",
		"password":"secret"
	}

Applications base url can be also configured to `db.json` as follows:
	"baseUrl": "/example"

WMS service is called via Node so the proxy might be required to be able to access to the service. If so, proxy can be configured to `db.json`as follows:
	"wmsProxy": "http://example"

## Create database tables

Create database tables by running `sld_styles_create_tables_script.sql`, which is found under sql folder.

## Add users

SLD-editor application requires authentication before it can be used. Every user has username, password and role. There are two roles available: ADMIN and USER. Admin has all the rights in the application, but user can't delete SLD templates and can edit and delete only SLD configurations created by himself/herself.
Users should be added to database table `sld_users`.  It can be done by running the following sql lines with information of users:

	INSERT INTO sld_users("user", pw, role)   VALUES ('','','');
	INSERT INTO sld_users("user", pw, role)   VALUES ('','',''); 

## Run SLD-editor

Run `node app` to get SLD-editor up and running.

## Versioning

SLD-Editor uses Semantic Versioning and follows the guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).

## Known issues

* Rule preview doesn't render other point symbolizer symbols than circle.
* User passwords are as clear text in database.
* [Backbone.Validation](https://github.com/thedersen/backbone.validation) is used to validate the model before saving, but it's still unfinished. Backbone.Validation is planned to be used also in server side validation.
* Unhandled error occurs if user tries to import invalid sld-file.

## Report bugs

If any bugs are found, please report them using GitHub issues.

## Copyright and license

Copyright 2014 NLS under dual license MIT (included LICENSE-MIT.txt) and [EUPL](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl)
(any language version applies, English version is included in LICENSE-EUPL.pdf).