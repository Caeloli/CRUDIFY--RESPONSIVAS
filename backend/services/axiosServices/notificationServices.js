const { default: axios } = require("axios");

//const notifAddress = "http://localhost:10333"; 
const notifAddress = "http://pmxresp-notifications-service"; //process.env.PMXRESP_NOTIFICATIONS_SERVICE_SERVICE_HOST ?? 
//const schedulerAddress =  "http://localhost:10335"; //"http://pmxresp-scheduler-service"; //process.env.PMXRESP_SCHEDULER_SERVICE_SERVICE_HOST ?? ;
const schedulerAddress =  "http://pmxresp-scheduler-service"; //process.env.PMXRESP_SCHEDULER_SERVICE_SERVICE_HOST ?? ;

async function sendNotificationEmail(to, subject, text) {
  try {
    axios.post(`${notifAddress}/send-email`, {
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
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
    console.log("Telegram message sent successfully");
  } catch (error) {
    console.error(
      "Error al enviar el mensaje telegram de notificación:",
      error
    );
    throw error; // Propagate the error to the caller
  }
}

async function restartBotTelegram() {
  try{
    axios.post(`${notifAddress}/restart-bot`);
    console.log("Telegram bot restart successfully");
  } catch(error){
    console.error(
      "Error al enviar la petición de reinicio del bot de telegram"
    );
  }
}

async function restartScheduler() {
  try{
    axios.post(`${schedulerAddress}/restart-scheduler`);
    console.log("Scheduler restart successfully");
  } catch(error){
    console.error(
      "Error al enviar la petición de reinicio del bot de telegram"
    );
  }
}

module.exports = {
  sendNotificationTelegram,
  sendNotificationEmail,
  restartBotTelegram,
  restartScheduler,
};
