
-- Drop tables with foreign key relationships first
DROP TABLE IF EXISTS authorization_allow;
DROP TABLE IF EXISTS authorization_request;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS responsive_files;

-- Drop tables with primary key relationships next
DROP TABLE IF EXISTS actions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS user_type;

CREATE TABLE
    user_type(
        user_type_id SERIAL PRIMARY KEY,
        user_type VARCHAR(10) NOT NULL
    );



CREATE TABLE
    states (
        state_id SERIAL PRIMARY KEY,
        state_name VARCHAR(10) NOT NULL
    );



CREATE TABLE
    users(
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(60) NOT NULL,
        user_type_id_fk INT REFERENCES user_type(user_type_id)
    );



CREATE TABLE
    actions(
        action_id SERIAL PRIMARY KEY,
        description VARCHAR(10) NOT NULL
    );



CREATE TABLE
    responsive_files (
        resp_id SERIAL PRIMARY KEY,
        user_id_fk INT REFERENCES users(user_id) NOT NULL,
        state_id_fk INT REFERENCES states(state_id),
        files_fk INT REFERENCES files(files_id)
        remedy VARCHAR(30) NOT NULL,
        token VARCHAR(30) NOT NULL,
        user_name VARCHAR(50) NOT NULL,
        email VARCHAR(30) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        immediately_chief VARCHAR(50) NOT NULL,
        windows_server VARCHAR(50) NOT NULL,
        domain VARCHAR(50) NOT NULL,
        account VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        file_format INT NOT NULL,
        file_route TEXT NOT NULL
    );

CREATE TABLE
    files (
        files_id SERIAL PRIMARY KEY,
        file_original_name VARCHAR(200) NOT NULL,
        file_unique_name VARCHAR(200) NOT NULL
    );

CREATE TABLE
    audit_log(
        log_id SERIAL PRIMARY KEY,
        file_id_fk INT REFERENCES responsive_files(resp_id) NOT NULL,
        user_id_fk INT REFERENCES users(user_id) NOT NULL,
        action_id_fk INT REFERENCES actions(action_id) NOT NULL,
        details JSON NOT NULL,
        date TIMESTAMP NOT NULL,
        additional_details JSONB DEFAULT '{}'
    );



CREATE TABLE
    authorization_request(
        request_id SERIAL PRIMARY KEY,
        user_id_fk INT REFERENCES users(user_id) NOT NULL,
        action_id_fk INT REFERENCES actions(action_id),
        request_date TIMESTAMP NOT NULL,
        affected_user_id INT NULL,
        affected_email VARCHAR(50) NULL,
        affected_type INT NULL
    );



CREATE TABLE
    authorization_allow(
        allow_id SERIAL PRIMARY KEY,
        request_id_fk INT REFERENCES authorization_request(request_id) NOT NULL,
        user_id_fk INT REFERENCES users(user_id) NOT NULL,
        is_allowed BOOLEAN NOT NULL
    );

INSERT INTO
    actions (description)
VALUES ('INSERT'), ('UPDATE'), ('DELETE');

INSERT INTO user_type (user_type) VALUES ('mt'), ('ma');

INSERT INTO states (state_name)
VALUES ('active'), ('notify'), ('expired');
#Fu
CREATE OR REPLACE FUNCTION SET_RESPONSIVE_FILES_STATE
() RETURNS TRIGGER AS
	$set_responsive_files_state$ 
	BEGIN DECLARE days_difference INT;
	BEGIN days_difference := EXTRACT(EPOCH FROM (NEW.end_date - NEW.start_date)) / (24 * 60 * 60)::INT;
	IF days_difference > 30 THEN NEW.state_id_fk := (
	    SELECT state_id
	    FROM states
	    WHERE
	        state_name = 'active'
	);
	ELSIF days_difference <= 30
	AND days_difference > 0 THEN NEW.state_id_fk := (
	    SELECT state_id
	    FROM states
	    WHERE
	        state_name = 'notify'
	);
	ELSE NEW.state_id_fk := (
	    SELECT state_id
	    FROM states
	    WHERE
	        state_name = 'expired'
	);
	END IF;
	RETURN NEW;
	END;
	END;
	$set_responsive_files_state$ LANGUAGE plpgsql;


DROP TRIGGER
    IF EXISTS set_responsive_files_state ON responsive_files;

CREATE TRIGGER set_responsive_files_state
	BEFORE
	INSERT OR UPDATE
	    ON responsive_files FOR EACH ROW
	EXECUTE
	    FUNCTION SET_RESPONSIVE_FILES_STATE();


/*
 CREATE OR REPLACE FUNCTION schedule_update()
 RETURN TRIGGER AS $$
 BEGIN
 PERFORM update_responsive_files_state();
 RETURN NULL;
 END;
 $$ LANGUAGE plpgsql;
 */