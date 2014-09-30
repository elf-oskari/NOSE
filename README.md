# SLD-Editor

SLD-Editor is an Node.js based SLD backend.

## Getting started

1. Install [Node.js](http://nodejs.org/download/) locally
2. Follow the installation guides and if special permissions are needed, ask your Admin to add usage rights to the folders
3. npm install
4. node parse.js original.sld template.sld > fields.csv
5. Modify fields.csv
6. node build.js template.sld fields.csv > new.sld

If you want to store an SLD template in a PostgreSQL database after creating it:

1. Use sql/sld_styles_create_tables_script.sql to set up your database
2. To avoid accidentally publishing database credentials, use: git update-index --assume-unchanged db.json
3. Modify db.json
4. node store.js template.sld fields.csv

## Versioning

SLD-Editor uses Semantic Versioning and follows the guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).

## Copyright and license

Copyright 2014 NLS under dual license MIT (included LICENSE-MIT.txt) and [EUPL](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl)
(any language version applies, English version is included in LICENSE-EUPL.pdf).
