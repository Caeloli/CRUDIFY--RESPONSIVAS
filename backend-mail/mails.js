const nodemailer = require("nodemailer");
require("dotenv").config();
// Función para enviar correo electrónico

let transporter = undefined;

async function transportCreate() {
  transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Servidor SMTP de Outlook
    port: 587, // Puerto SMTP para Outlook
    secure: false,
    auth: {
      user: "pmxresp@outlook.com", // Correo electrónico del remitente
      pass: process.env.SECRET_MAIL_PASSWORD ?? "s0port3+Adm1n", // Contraseña del remitente
    },
  });
}
async function sendEmail(to, subject, text) {
  // Opciones del mensaje de correo electrónico
  const mailOptions = {
    from: "pmxresp@outlook.com", // Correo electrónico del remitente
    to, // Correo electrónico del destinatario
    subject, // Asunto del correo electrónico
    text, // Cuerpo del correo electrónico
  };

  // Envío del correo electrónico
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
}

// Ejemplo de uso de la función sendEmail
module.exports = {
  transportCreate,
  sendEmail,
};
