import logging
import re
from telegram import Update, Bot
from telegram.constants import ParseMode
from telegram.ext import ApplicationBuilder, ContextTypes, CallbackContext, filters, CommandHandler, ConversationHandler, MessageHandler
from database import insert_new_request_for_user
EMAIL_INPUT = 0
TOKEN = "6668462504:AAH31jG4kyxX3FHMx1TcnpEkKeZstsBoO50"
async def send_notification(message):
    token = TOKEN
    bot = Bot(token=token)
    print("Envío de mensaje")
    await bot.send_message(chat_id = -1001612435955, text=message, parse_mode=ParseMode.HTML)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("La consola recibió esta notif start")
    await context.bot.send_message(chat_id=update.effective_chat.id, text="I'm a bot, please talk to me!")

async def send_to_groups(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("La consola recibió esta notif groups")
    chat_id = -1001612435955;
    print("Enviando a chat_id ", chat_id);
    await context.bot.send_message(chat_id=chat_id, text="Hello. I'm just messaging to test");
    #for chat_id in chats:
    #    await context.bot.send_message(chat_id=chat_id, text="Hello, I'm messaging every group!")

async def register_user(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print("La consola se envia")
    await update.message.reply_text("Estás a punto de registrar una cuenta para acceder al sistema de responsivas. Favor de ingresar un correo electrónico válido:")
    return EMAIL_INPUT

async def save_email(update: Update, context: CallbackContext):
    email = update.message.text
    chat_id = update.message.chat_id
    # Perform any validation or saving logic here
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    if not email_pattern.match(email):
        await update.message.reply_text("Formato de correo electrónico inválido. Por favor ingrese un correo electrónico válido.")
        return EMAIL_INPUT  # Return to the email input state
    # Acknowledge the registration
    insert_new_request_for_user(email=email, chat_id=chat_id)
    await update.message.reply_text(f"Gracias, tu correo electrónico: {email} fue registrado exitósamente. Esperando confirmación del administrador")

    # End the conversation
    return ConversationHandler.END

async def cancel(update: Update, context: CallbackContext):
    update.message.reply_text("Registration canceled.")
    return ConversationHandler.END

if __name__ == '__main__':
    application = ApplicationBuilder().token(TOKEN).build()
    start_handler = CommandHandler('start', start)
    send_to_groups_handler = CommandHandler('send', send_to_groups)
    

    register_handler = ConversationHandler(
        entry_points=[CommandHandler('register', register_user)],
        states={
            EMAIL_INPUT: [MessageHandler(filters=(filters.TEXT & (~ filters.COMMAND)),  callback=save_email)]
        },
        fallbacks=[CommandHandler('cancel', cancel)],                                   
                                           )
    application.add_handler(start_handler)
    application.add_handler(register_handler)
    application.add_handler(send_to_groups_handler)
    application.run_polling()