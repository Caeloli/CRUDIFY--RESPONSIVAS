
-- Drop tables with foreign key relationships first
DROP TABLE IF EXISTS authorization_allow;
DROP TABLE IF EXISTS authorization_request;
DROP TABLE IF EXISTS reset_tokens;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS servers;
DROP TABLE IF EXISTS responsive_files;
DROP TABLE IF EXISTS notification_data;
-- Drop tables with primary key relationships next
DROP TABLE IF EXISTS users_servers;
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
    users_servers(
        user_server_id SERIAL PRIMARY KEY,
        user_server_username VARCHAR(100) NOT NULL,
        email VARCHAR(60) NOT NULL,
        token VARCHAR(30) NOT NULL,
        phone VARCHAR(30),
        immediately_chief VARCHAR(50),
        immediately_chief_email VARCHAR(60)
    );

CREATE TABLE
    users(
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(60) NOT NULL,
        pswrd VARCHAR(90) NOT NULL,
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
        user_servers_id_fk INT REFERENCES users_servers(user_server_id) NOT NULL,
        before_resp_id_fk INT REFERENCES responsive_files(resp_id),
        after_resp_id_fk INT REFERENCES responsive_files(resp_id),
        state_id_fk INT REFERENCES states(state_id),
        remedy VARCHAR(30) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        comment TEXT NULL,
        file_format INT NOT NULL
    );

CREATE TABLE
    files (
        files_id SERIAL PRIMARY KEY,
        resp_id_fk INT NOT NULL REFERENCES responsive_files(resp_id) ON DELETE CASCADE,
        file_original_name VARCHAR(200) NOT NULL,
        file_unique_name VARCHAR(200) NOT NULL,
        file_content BYTEA NOT NULL
    );

CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    file_id_fk INT NOT NULL REFERENCES responsive_files(resp_id) ON DELETE CASCADE,
    user_id_fk INT REFERENCES users(user_id),
    action_id_fk INT NOT NULL REFERENCES actions(action_id),
    details JSON NOT NULL DEFAULT '{}',
    date TIMESTAMP NOT NULL,
    additional_details JSONB DEFAULT '{}'
);



CREATE TABLE
    authorization_request(
        request_id SERIAL PRIMARY KEY,
        user_id_fk INT REFERENCES users(user_id) NULL,
        action_id_fk INT REFERENCES actions(action_id) NULL,
        request_date TIMESTAMP NOT NULL,
        affected_user_id INT NULL,
        affected_email VARCHAR(50) NULL,
        affected_type INT NULL,
        chat_id VARCHAR(30) NULL
    );



CREATE TABLE 
    authorization_allow (
        allow_id SERIAL PRIMARY KEY,
        request_id_fk INT REFERENCES authorization_request(request_id) ON DELETE CASCADE,
        user_id_fk INT REFERENCES users(user_id) ON DELETE CASCADE,
        is_allowed BOOLEAN NOT NULL
    );

CREATE TABLE servers (
    server_id SERIAL PRIMARY KEY,
    responsive_file_id_fk INT REFERENCES responsive_files(resp_id) ON DELETE CASCADE,
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    serial_number VARCHAR(100) NULL,
    location VARCHAR(100) NULL,
    hostname VARCHAR(100) NULL,
    ip_address VARCHAR(100) NULL,
    domain_server VARCHAR(60) NULL
);

CREATE TABLE IF NOT EXISTS notification_data (
    notif_data_id SERIAL PRIMARY KEY,
    bot_id VARCHAR(100) NOT NULL,
    chat_group_id VARCHAR(100) NOT NULL,
    notification_time TIME NOT NULL,
    CONSTRAINT unique_bot_id UNIQUE (bot_id)
);

 CREATE TABLE IF NOT EXISTS reset_tokens (
    reset_token_id SERIAL PRIMARY KEY,
    user_id_fk INT REFERENCES users(user_id) NOT NULL,
    reset_token VARCHAR(30) NOT NULL,
    reset_token_date TIMESTAMP NOT NULL,
    reset_token_status BOOLEAN NOT NULL
 );
 


INSERT INTO
    actions (description)
VALUES ('INSERT'), ('UPDATE'), ('DELETE');

INSERT INTO user_type (user_type) VALUES ('mt'), ('ma');

INSERT INTO states (state_name)
VALUES ('active'), ('notify'), ('expired'), ('notified'), ('cancelled'), ('renovated');

CREATE OR REPLACE FUNCTION SET_RESPONSIVE_FILES_STATE
() RETURNS TRIGGER AS
	$set_responsive_files_state$ 
	BEGIN DECLARE days_difference INT;
	BEGIN days_difference := EXTRACT(EPOCH FROM (NEW.end_date - NOW())) / (24 * 60 * 60)::INT;
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
	INSERT
	    ON responsive_files FOR EACH ROW
	EXECUTE
	    FUNCTION SET_RESPONSIVE_FILES_STATE();

-- Define a PostgreSQL function to update the state of responsive files based on certain conditions
CREATE OR REPLACE FUNCTION UPDATE_RESPONSIVE_FILES_STATE()
RETURNS TRIGGER AS $update_responsive_files_state$
DECLARE
    days_difference INT;
BEGIN
    -- Check if the state is already "cancelled", if so, ignore the update
    IF OLD.state_id_fk = (SELECT state_id FROM states WHERE state_name = 'cancelled') THEN
        RETURN OLD;
    END IF;

    -- Check if the new state is "cancelled", if so, ignore the update
    IF NEW.state_id_fk = (SELECT state_id FROM states WHERE state_name = 'cancelled') THEN 
        RETURN NEW;
    END IF;

    -- If after_resp_id_fk is not null, update state_id_fk to 'renovated'
    IF NEW.after_resp_id_fk IS NOT NULL THEN
        NEW.state_id_fk := (SELECT state_id FROM states WHERE state_name = 'renovated');
    
    -- If after_resp_id_fk is null, determine days_difference
    ELSE
        days_difference := EXTRACT(EPOCH FROM (NEW.end_date - NOW())) / (24 * 60 * 60)::INT;

        -- Update state based on days_difference
        IF days_difference > 30 THEN
            NEW.state_id_fk := (SELECT state_id FROM states WHERE state_name = 'active');
        ELSIF days_difference <= 30 AND days_difference > 0 THEN
            -- Check if the new state is already "notified", if so, ignore the update
            IF NEW.state_id_fk = (SELECT state_id FROM states WHERE state_name = 'notified') THEN 
                RETURN NEW;
            ELSE
                NEW.state_id_fk := (SELECT state_id FROM states WHERE state_name = 'notify');
            END IF;
        ELSE
            NEW.state_id_fk := (SELECT state_id FROM states WHERE state_name = 'expired');
        END IF;
    END IF;

    RETURN NEW; -- Return the updated row
END;
$update_responsive_files_state$
LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS update_responsive_files_state ON responsive_files;

CREATE TRIGGER update_responsive_files_state 
BEFORE UPDATE ON responsive_files 
FOR EACH ROW 
EXECUTE FUNCTION UPDATE_RESPONSIVE_FILES_STATE();




CREATE OR REPLACE FUNCTION VERIFY_RESPONSIVE_FILES_STATE(p_resp_id INT)
RETURNS VOID AS
$verify_responsive_files_state$
DECLARE
    days_difference INT;
    state_original_value INT;
BEGIN
    BEGIN
        -- Retrieve days difference between end_date and current date
        SELECT EXTRACT(EPOCH FROM (end_date - NOW())) / (24 * 60 * 60)::INT
        INTO days_difference
        FROM responsive_files
        WHERE resp_id = p_resp_id;

        -- Retrieve original state value
        SELECT state_id_fk INTO state_original_value FROM responsive_files WHERE resp_id = p_resp_id;
        
        -- Debugging information
        RAISE NOTICE 'Days Difference: %', days_difference;
        RAISE NOTICE 'State: %', state_original_value;

        -- Determine the new state based on the days difference
        IF state_original_value = 6 THEN
            RAISE NOTICE 'Updated to renewed';
        ELSIF state_original_value = 5 THEN
            RAISE NOTICE 'Updated to cancelled';
        ElSIF state_original_value = 4 THEN
            -- Update to 'notified' if expired
            IF days_difference < 0 THEN 
                RAISE NOTICE 'Updated to expired';
                UPDATE responsive_files
                SET state_id_fk = (SELECT state_id FROM states WHERE state_name = 'expired')
                WHERE resp_id = p_resp_id;
            END IF;
        ELSIF days_difference > 30 THEN
            -- Update to 'active'
            RAISE NOTICE 'Updating to active';
            UPDATE responsive_files
            SET state_id_fk = (SELECT state_id FROM states WHERE state_name = 'active')
            WHERE resp_id = p_resp_id;
        ELSIF days_difference <= 30 AND days_difference > 0 THEN
            -- Update to 'notify'
            RAISE NOTICE 'Updating to notify';
            UPDATE responsive_files
            SET state_id_fk = (SELECT state_id FROM states WHERE state_name = 'notify')
            WHERE resp_id = p_resp_id;
        ELSE
            -- Update to 'expired' if already notified
            RAISE NOTICE 'Updating to expired';
            UPDATE responsive_files
            SET state_id_fk = (SELECT state_id FROM states WHERE state_name = 'expired')
            WHERE resp_id = p_resp_id;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Handle any errors that may occur
            RAISE EXCEPTION 'Error updating state for responsive file %: %', p_resp_id, SQLERRM;
    END;
END;
$verify_responsive_files_state$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION insert_authorization_allow()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO authorization_allow (request_id_fk, user_id_fk, is_allowed)
  SELECT NEW.request_id, user_id, FALSE
  FROM users
  WHERE user_type_id_fk = 2;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create an AFTER INSERT trigger on the authorization_request table
CREATE TRIGGER authorization_request_insert_trigger
AFTER INSERT ON authorization_request
FOR EACH ROW
EXECUTE FUNCTION insert_authorization_allow();

/*
 CREATE OR REPLACE FUNCTION schedule_update()
 RETURN TRIGGER AS $$
 BEGIN
 PERFORM update_responsive_files_state();
 RETURN NULL;
 END;
 $$ LANGUAGE plpgsql;
 */


/***

INSTANCIA

***/

