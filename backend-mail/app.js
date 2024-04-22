const express = require("express");
const mail = require("./mails");
const Queue = require("queue-promise");
const logger = require("morgan");
require("dotenv").config();
require("./bot").startBot();
const bot = require("./bot");
const app = express();
const port = 10333; // Puerto en el que se ejecutará el servidor

const emailQueue = new Queue({
  concurrency: 1,
});
const botQueue = new Queue({
  concurrency: 1,
});
(async () => {
  try {
    await mail.transportCreate();
    console.log("E-Mail Transport created succesfully");
  } catch (error) {
    console.error("Error while creating the e-mail transport: ", error);
    process.exit(1); // Salir del proceso con un código de error
  }
})();
// Middleware para analizar solicitudes JSON
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  console.log("TO ", to, "Subject ", subject, "Text ", text);
  try {
    let recipients;
    if (Array.isArray(to)) {
      
      recipients = to.join(", ");
    } else {
      
      recipients = to;
    }

    
    await emailQueue.add(async () => {
      console.log("Sending mail to: ", recipients);

      await mail.sendEmail(recipients, subject, text);
    });

    res.status(200).send("Mail sent succesfully");
  } catch (error) {
    console.error("Error while sending mail:", error);
    res.status(500).send("Error while sending mail");
  }
});

app.post("/send-tmessage", async (req, res) => {
  try {
    const { chatID, text } = req.body;

    await botQueue.add(async () => {
      console.log("Sending text to: ", chatID);
      await bot.sendNotification(text, chatID);
    });

    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Failed to send message");
  }
});

app.post("/restart-bot", async (req,res) => {
  try{
    await bot.restartBot();
    res.status(200).send("Bot restarted successfully");
  } catch(error){
    console.error("Error restarting bot:", error);
    res.status(500).send("Failed to restart bot");
  }
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express.js en ejecución en http://${process.env.PMXRESP_NOTIFICATIONS_SERVICE_SERVICE_HOST}:${port}`);
});
