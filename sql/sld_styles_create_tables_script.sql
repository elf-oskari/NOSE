-- Create scripts for sld_styles Postgres db

CREATE DATABASE sld_styles
  WITH OWNER = "MBLOMBERG"
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'Finnish_Finland.1252'
       LC_CTYPE = 'Finnish_Finland.1252'
       CONNECTION LIMIT = -1;
-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_template


-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_template


-- Function: procedure_sld_template_update()

-- DROP FUNCTION procedure_sld_template_update();

CREATE OR REPLACE FUNCTION procedure_sld_template_update()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_OP = 'UPDATE') THEN
		NEW.updated := current_timestamp;
	RETURN NEW;
	ELSIF (TG_OP = 'INSERT') THEN
		NEW.created := current_timestamp;
	RETURN NEW;
	END IF;
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;



-- Table: sld_template

-- DROP TABLE sld_template;

CREATE TABLE sld_template
(
  id bigserial NOT NULL,
  uuid character varying(64),
  name character varying(256) NOT NULL,
  sld_filename character varying(128),
  wms_url character varying(512),
  content text,
  created timestamp with time zone NOT NULL,
  updated timestamp with time zone,
  CONSTRAINT sld_template_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);



-- Trigger: trigger_sld_template on sld_template

-- DROP TRIGGER trigger_sld_template ON sld_template;

CREATE TRIGGER trigger_sld_template
  BEFORE INSERT OR UPDATE
  ON sld_template
  FOR EACH ROW
  EXECUTE PROCEDURE procedure_sld_template_update();

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_config

-- Function: procedure_sld_config_update()

-- DROP FUNCTION procedure_sld_config_update();

CREATE OR REPLACE FUNCTION procedure_sld_config_update()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_OP = 'UPDATE') THEN
		NEW.updated := current_timestamp;
	RETURN NEW;
	ELSIF (TG_OP = 'INSERT') THEN
		NEW.created := current_timestamp;
	RETURN NEW;
	END IF;
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;



-- Table: sld_config

-- DROP TABLE sld_config;

CREATE TABLE sld_config
(
  id bigserial NOT NULL,
  uuid character varying(64),
  template_id  bigint,
  name character varying(256) NOT NULL,
  output_path character varying(512) NOT NULL,
  created timestamp with time zone NOT NULL,
  updated timestamp with time zone,
  CONSTRAINT sld_config_pkey PRIMARY KEY (id),
  CONSTRAINT template_id_fkey FOREIGN KEY (template_id)
      REFERENCES sld_template (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);



-- Trigger: trigger_sld_config on sld_config

-- DROP TRIGGER trigger_sld_config ON sld_config;

CREATE TRIGGER trigger_sld_config
  BEFORE INSERT OR UPDATE
  ON sld_config
  FOR EACH ROW
  EXECUTE PROCEDURE procedure_sld_config_update();

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_type


-- Table: sld_type

-- DROP TABLE sld_type;

CREATE TABLE sld_type
(
  id bigserial NOT NULL,
  name character varying(256) NOT NULL,
  symbolizer_parameter character varying(256) NOT NULL,
  search_tag character varying(256) NOT NULL,
  CONSTRAINT sld_type_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_featuretype


-- Table: sld_featuretype

-- DROP TABLE sld_featuretype;

CREATE TABLE sld_featuretype
(
  id bigserial NOT NULL,
  template_id  bigint,
  name character varying(256) NOT NULL,
  title character varying(256) NOT NULL,
  featuretype_name character varying(256) NOT NULL,
  feature_order integer,
  CONSTRAINT sld_featuretype_pkey PRIMARY KEY (id),
  CONSTRAINT template_id_fkey FOREIGN KEY (template_id)
      REFERENCES sld_template (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);


-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_rule


-- Table: sld_rule

-- DROP TABLE sld_rule;

CREATE TABLE sld_rule
(
  id bigserial NOT NULL,
  featuretype_id  bigint,
  name character varying(256) NOT NULL,
  title character varying(256) NOT NULL,
  abstract character varying(512) NOT NULL,
  CONSTRAINT sld_rule_pkey PRIMARY KEY (id),
  CONSTRAINT featuretype_id_fkey FOREIGN KEY (featuretype_id)
      REFERENCES sld_featuretype (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_symbolizer
-- Table: sld_symbolizer

-- DROP TABLE sld_symbolizer;

CREATE TABLE sld_symbolizer
(
  id bigserial NOT NULL,
  rule_id bigint,
  symbolizer_order integer,
  symbolizer_type character varying(32) NOT NULL,
  CONSTRAINT sld_symbolizer_pkey PRIMARY KEY (id),
  CONSTRAINT rule_id_fkey FOREIGN KEY (rule_id)
      REFERENCES sld_rule (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_param


-- Table: sld_param

-- DROP TABLE sld_param;

CREATE TABLE sld_param
(
  id bigserial NOT NULL,
  symbolizer_id  bigint,
  template_offset  int,
  type_id  bigint,
  default_value character varying(512) NOT NULL,
  CONSTRAINT sld_param_pkey PRIMARY KEY (id),
  CONSTRAINT symbolizer_id_fkey FOREIGN KEY (symbolizer_id)
      REFERENCES sld_symbolizer (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT type_id_fkey FOREIGN KEY (type_id)
      REFERENCES sld_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_value


-- Table: sld_value

-- DROP TABLE sld_value;

CREATE TABLE sld_value
(
  id bigserial NOT NULL,
  config_id  bigint,
  param_id  bigint,
  value text,
  CONSTRAINT sld_value_pkey PRIMARY KEY (id),
  CONSTRAINT config_id_fkey FOREIGN KEY (config_id)
      REFERENCES sld_config (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT param_id_fkey FOREIGN KEY (param_id)
      REFERENCES sld_param (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);

CREATE  VIEW sld_all_test AS
 SELECT a.id AS sld_id,
    a.name AS template,
    b.id AS featuretype_id,
    b.name AS featuretype,
    b.feature_order,
    c.name AS rule,
    e.id AS param_id,
    e.template_offset,
    e.default_value,
    d.symbolizer_order,
    d.symbolizer_type,
    f.name AS param_name,
    f.symbolizer_parameter
   FROM sld_template a,
    sld_featuretype b,
    sld_rule c,
    sld_symbolizer d,
    sld_param e,
    sld_type f
  WHERE a.id = b.template_id AND b.id = c.featuretype_id AND c.id = d.rule_id AND d.id = e.symbolizer_id AND e.type_id = f.id;



CREATE VIEW sld_params_view AS
 SELECT e.id,
    a.id AS template_id,
    e.symbolizer_id,
    e.template_offset,
    e.default_value,
    f.name,
    f.symbolizer_parameter
   FROM sld_template a,
    sld_featuretype b,
    sld_rule c,
    sld_symbolizer d,
    sld_param e,
    sld_type f
  WHERE a.id = b.template_id AND b.id = c.featuretype_id AND c.id = d.rule_id AND d.id = e.symbolizer_id AND e.type_id = f.id;

 CREATE VIEW sld_rule_view AS
 SELECT c.id,
    a.id AS template_id,
    c.featuretype_id,
    c.name,
    c.title,
    c.abstract
   FROM sld_template a,
    sld_featuretype b,
    sld_rule c
  WHERE  a.id = b.template_id AND b.id = c.featuretype_id;

CREATE  VIEW sld_symbolizer_view AS
 SELECT d.id,
    a.id AS template_id,
    d.rule_id,
    d.symbolizer_order,
    d.symbolizer_type
   FROM sld_template a,
    sld_featuretype b,
    sld_rule c,
    sld_symbolizer d
  WHERE  a.id = b.template_id AND b.id = c.featuretype_id AND c.id = d.rule_id;

-- Prepare sld_type table for parameters
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'WellKnownName', 'Graphic/Mark/WellKnownName', '"Graphic","Mark","WellKnownName"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Fill', 'Graphic/Mark/Fill/CssParameter(fill)', '"Graphic","Mark","Fill","CssParameter",{"name":"fill"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke', 'Stroke/CssParameter(stroke)', '"Stroke","CssParameter",{"name":"stroke"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke', 'Graphic/Mark/Stroke', '"Graphic","Mark","Stroke"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke-width', 'Stroke/CssParameter(stroke-width)', '"Stroke","CssParameter",{"name":"stroke-width"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'WellKnownName', 'Fill/GraphicFill/Graphic/Mark/WellKnownName', '"Fill","GraphicFill","Graphic","Mark","WellKnownName"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke', 'Fill/GraphicFill/Graphic/Mark/Stroke/CssParameter(stroke)', '"Fill","GraphicFill","Graphic","Mark","Stroke","CssParameter",{"name":"stroke"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke-width', 'Fill/GraphicFill/Graphic/Mark/Stroke/CssParameter(stroke-width)', '"Fill","GraphicFill","Graphic","Mark","Stroke","CssParameter",{"name":"stroke-width"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Size', 'Fill/GraphicFill/Graphic/Size', '"Fill","GraphicFill","Graphic","Size"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Size', 'Size/Literal', '"Size","Literal"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Size', 'Graphic/Size', '"Graphic","Size"');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Stroke-linecal', 'Stroke/CssParameter(stroke-linecap)', '"Stroke","CssParameter",{"name":"stroke-linecap"}');
INSERT INTO sld_type ( name, symbolizer_parameter, search_tag) VALUES ( 'Fill', 'Fill/CssParameter(fill)', '"Fill","CssParameter",{"name":"fill"}');

