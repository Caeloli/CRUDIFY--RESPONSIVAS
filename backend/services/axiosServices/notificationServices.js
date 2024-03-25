const { default: axios } = require("axios");

const notifAddress = process.env.NOTIFICATIONS_ADDRESS;

async function sendNotificationEmail(to, subject, text) {
  try {
    axios.post(`${notifAddress}/send-email`, {
      to,
      subject,
      text,
    });
    console.log("Correo electrónico de notificación enviado correctamente");
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de notificación:",
      error
    );
    throw error; // Propagate the error to the caller
  }
}

async function sendNotificationTelegram(chatID, text) {
  try {
    axios.post(`${notifAddress}/send-tmessage`, {
      chatID,
      text,
    });
    console.log("Mensaje Telegram de notificación enviado correctamente");
  } catch (error) {
    console.error(
      "Error al enviar el mensaje telegram de notificación:",
      error
    );
    throw error; // Propagate the error to the caller
  }
}

module.exports = {
  sendNotificationTelegram,
  sendNotificationEmail,
};
