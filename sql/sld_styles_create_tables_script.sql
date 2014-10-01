CREATE DATABASE sld_styles
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;
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
ALTER FUNCTION procedure_sld_template_update()
  OWNER TO liferay;



-- Table: sld_template

-- DROP TABLE sld_template;

CREATE TABLE sld_template
(
  id bigserial NOT NULL,
  uuid character varying(64),
  name character varying(256) NOT NULL,
  wms_url character varying(512),
  content text,
  created timestamp with time zone NOT NULL,
  updated timestamp with time zone,
  CONSTRAINT sld_template_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_template
  OWNER TO liferay;
GRANT ALL ON TABLE sld_template TO liferay;


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
ALTER FUNCTION procedure_sld_config_update()
  OWNER TO liferay;



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
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_config
  OWNER TO liferay;
GRANT ALL ON TABLE sld_config TO liferay;


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
  symbolizer character varying(256) NOT NULL,
  CONSTRAINT sld_type_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_type
  OWNER TO liferay;
GRANT ALL ON TABLE sld_type TO liferay;

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
  CONSTRAINT sld_featuretype_pkey PRIMARY KEY (id),
  CONSTRAINT template_id_fkey FOREIGN KEY (template_id)
      REFERENCES sld_template (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_featuretype
  OWNER TO liferay;
GRANT ALL ON TABLE sld_featuretype TO liferay;


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
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_rule
  OWNER TO liferay;
GRANT ALL ON TABLE sld_rule TO liferay;

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_param


-- Table: sld_param

-- DROP TABLE sld_param;

CREATE TABLE sld_param
(
  id bigserial NOT NULL,
  rule_id  bigint,
  template_offset  int,
  type_id  bigint,
  default_value character varying(512) NOT NULL,
  CONSTRAINT sld_param_pkey PRIMARY KEY (id),
  CONSTRAINT rule_id_fkey FOREIGN KEY (rule_id)
      REFERENCES sld_rule (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT type_id_fkey FOREIGN KEY (type_id)
      REFERENCES sld_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_param
  OWNER TO liferay;
GRANT ALL ON TABLE sld_param TO liferay;

-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sld_value


-- Table: sld_value

-- DROP TABLE sld_value;

CREATE TABLE sld_value
(
  id bigserial NOT NULL,
  config_id  bigint,
  param_id  bigint,
  data text,
  CONSTRAINT sld_value_pkey PRIMARY KEY (id),
  CONSTRAINT config_id_fkey FOREIGN KEY (config_id)
      REFERENCES sld_config (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT param_id_fkey FOREIGN KEY (param_id)
      REFERENCES sld_param (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sld_value
  OWNER TO liferay;
GRANT ALL ON TABLE sld_value TO liferay;

