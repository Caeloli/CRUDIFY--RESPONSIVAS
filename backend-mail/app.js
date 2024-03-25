const express = require("express");
const mail = require("./mails");
const Queue = require("queue-promise");
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
    console.log("Transporte de correo electrónico creado correctamente");
  } catch (error) {
    console.error("Error al crear el transporte de correo electrónico:", error);
    process.exit(1); // Salir del proceso con un código de error
  }
})();
// Middleware para analizar solicitudes JSON
app.use(express.json());

// Ruta para manejar solicitudes POST de envío de correo electrónico
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  console.log("TO ", to, "Subject ", subject, "Text ", text);
  try {
    let recipients;
    if (Array.isArray(to)) {
      // If 'to' is an array, join the email addresses
      recipients = to.join(", ");
    } else {
      // If 'to' is not an array, use it as is
      recipients = to;
    }

    // Opciones del mensaje de correo electrónico
    await emailQueue.add(async () => {
      console.log("Sending mail to: ", recipients);

      await mail.sendEmail(recipients, subject, text);
    });

    res.status(200).send("Correo electrónico enviado correctamente");
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    res.status(500).send("Error al enviar el correo electrónico");
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express.js en ejecución en http://localhost:${port}`);
});
