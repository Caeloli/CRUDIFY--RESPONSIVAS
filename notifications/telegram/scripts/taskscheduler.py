import asyncio
import schedule
import time
import os
from datetime import datetime
import pytz
from database import check_expiration_dates, update_responsive_notify_state, update_responsive_notfications_state, get_all_responsives
from simple_bot import send_notification

url_name = "localhost:4000/files/"

def job():
    responsives = check_expiration_dates()
    print(responsives)
    for responsive in responsives: 
        resp_id= responsive[0]
        state_id_fk = responsive[1]
        remedy = responsive[2]
        user_name = responsive[3]
        email = responsive[4]
        phone = responsive[5]
        immediately_chief = responsive[6]
        start_date = responsive[7]
        end_date = responsive[8]
        file_name = os.path.basename(responsive[9])
        text = (
        "🔔 NOTIFICACIÓN RESPONSIVA\n\n"
        f" **Usuario:** {user_name}\n"
        f" **Correo:** {email}\n"
        f" **Teléfono:** {phone}\n"+
        f" **Jefe Inmediato:** {immediately_chief}\n"
        f" **Fecha Final:** {end_date}\n"
        f" **URL:** <a href='{url_name}{file_name}'>Ver Archivo</a>\n"
        )
        try:
            asyncio.run(send_notification(text))
            update_responsive_notify_state(resp_id)
        except ValueError as e: 
            print(f"Error: No se logró enviar{e}")
        
    

def update_responsive_status():
    responsives = get_all_responsives()
    for responsive in responsives:
        print("actualizando resp_id: ", responsive[0])
        update_responsive_notfications_state(responsive[0])
    


def main():
    # Set the time zone for Mexico City
    mexico_city_timezone = pytz.timezone("America/Mexico_City")

    # Get the current time in Mexico City
    current_time = datetime.now(mexico_city_timezone).strftime("%H:%M")
    print(f"Current time in Mexico City: {current_time}")

    schedule_notification_time = "11:47"
    schedule_update_notification_status = "11:48"
    schedule.every().day.at(schedule_notification_time).do(job)
    schedule.every().day.at(schedule_update_notification_status).do(update_responsive_status)

    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Job stopped.")

if __name__ == "__main__":
    main()