const nodemailer = require("nodemailer");
require("dotenv").config();
// Función para enviar correo electrónico

let transporter = undefined;

async function transportCreate() {
  transporter = nodemailer.createTransport({
    /*host: "smtpapps.un.pemex.com",
    port: 25,
    secure: false, // true for 465
    tls: {
      
      rejectUnauthorized: false
    }
    */
    host: "smtp.office365.com", // SMTP server for Outlook
    port: 587, // SMTP Port for Outlook
    secure: false,
    auth: {
      user: "pmxresp@outlook.com",
      pass: process.env.SECRET_MAIL_PASSWORD ?? "s0port3+Adm1n", 
    },
    
  });
}
async function sendEmail(to, subject, text) {
  // Mail options 
  const mailOptions = {
    //from: "pmxresp@outlook.com", // Correo electrónico del remitente
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

module.exports = {
  transportCreate,
  sendEmail,
};
