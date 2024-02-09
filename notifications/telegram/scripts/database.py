import psycopg2
from psycopg2 import sql
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "pmrresp"
DB_USER = "postgres"
DB_PASSWORD = "1234"

def connect_to_database():
    connection = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, database=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )
    return connection

def check_expiration_dates():
    connection = connect_to_database()
    cursor = connection.cursor()
    query = "SELECT resp_id, state_id_fk, remedy, user_name, email, phone, immediately_chief, start_date, end_date, file_route, end_date - CURRENT_DATE AS intervalo FROM responsive_files WHERE end_date - CURRENT_DATE = interval '30 days'"
    cursor.execute(query=query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return results

def update_responsive_notfications_state(resp_id):
    try:
        # Establish a connection
        with connect_to_database() as connection:
            # Create a cursor within the context of the connection
            with connection.cursor() as cursor:
                # Use a parameterized query to prevent SQL injection
                query = sql.SQL("SELECT verify_responsive_files_state({})").format(sql.Literal(resp_id))
                cursor.execute(query)
                
            # Commit the changes to the database
            connection.commit()
            
    except psycopg2.Error as e:
        # Handle any database errors here
        print(f"Database error: {e}")
        # You might want to log the error or handle it in an appropriate way
        # Return an error code or message as needed

def update_responsive_notify_state(resp_id):
    try:
        # Establish a connection
        with connect_to_database() as connection:
            # Create a cursor within the context of the connection
            with connection.cursor() as cursor:
                # Use a parameterized query to prevent SQL injection
                query = sql.SQL("UPDATE responsive_files SET state_id_fk = 4 WHERE resp_id = {}").format(sql.Literal(resp_id))
                cursor.execute(query)
                
            # Commit the changes to the database
            connection.commit()
            
    except psycopg2.Error as e:
        # Handle any database errors here
        print(f"Database error: {e}")
        # You might want to log the error or handle it in an appropriate way
        # Return an error code or message as needed

def insert_new_request_for_user(email, chat_id):
    try:
        with connect_to_database() as connection:
            with connection.cursor() as cursor:
                query = sql.SQL("INSERT INTO authorization_request(action_id_fk, request_date, affected_email, affected_type, chat_id) VALUES (1, NOW(), {}, 1, {});").format(sql.Literal(email), sql.Literal(chat_id))
                cursor.execute(query)
            connection.commit()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
    

def get_all_responsives():
    connection = connect_to_database()
    cursor = connection.cursor()
    query = "SELECT resp_id FROM responsive_files"
    cursor.execute(query=query)
    results = cursor.fetchall()
    cursor.close()
    return results
