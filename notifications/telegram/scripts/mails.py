import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(subject, body, to_email):
    # Your email credentials
    sender_email = 'respnotif@gmail.com'
    app_password = "elga apkx bloj ahgw"


    # Create the MIME object
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server: 
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(from_addr=sender_email, to_addrs=to_email, msg=msg.as_string())

      
# Example usage
subject = 'Notification Subject'
body = 'This is the body of your notification.'
to_email = 'caeloleame13@gmail.com'

send_email(subject, body, to_email)

print("Correo enviado")