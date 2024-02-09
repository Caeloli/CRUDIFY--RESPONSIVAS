const schedule = require("node-schedule");
const { DateTime } = require("luxon");
const path = require("path");
const fs = require('fs');
const responsiveFileController = require("../../controller/responsiveFileController");
const auditLogController = require("../../controller/auditLogController");
const { sendNotification } = require("../bot/tbot");
const {
  postgreSQLUpdateResponsiveNotficationsState,
} = require("../dbServices");
const { checkExpirationDates } = require("../fileServices");
const url_name = "http://localhost:4000/pmx-resp/files/";

async function job() {
  try {
    const responsives = await checkExpirationDates();
    responsives.forEach((responsive) => {
      const {
        resp_id,
        state_id_fk,
        remedy,
        user_name,
        email,
        phone,
        immediately_chief,
        start_date,
        end_date,
        file_route,
      } = responsive;
      
      const file_name = file_route ? path.basename(file_route) : "";
      
      
      const text =
        `🔔 NOTIFICACIÓN RESPONSIVA\n\n` +
        ` **Usuario:** ${user_name}\n` +
        ` **Correo:** ${email}\n` +
        ` **Teléfono:** ${phone}\n` +
        ` **Jefe Inmediato:** ${immediately_chief}\n` +
        ` **Fecha Final:** ${end_date}\n` +
        ` **URL:** <a href="${url_name}${file_name}">[Ver Archivo]</a>\n(${url_name}${file_name})\n`;
      try {
        const chat_id = process.env.TELEGRAM_CHAT_GROUP_ID;
        console.log("Notifying Responsive with ID: ", resp_id);
        sendNotification(text, chat_id, 'text');
        responsiveFileController.updateResponsiveFile(resp_id, {
          state_id_fk: 4,
        });
      } catch (error) {
        console.error(`Error sending notification: ${error}`);
      }
    });
  } catch (error) {
    console.error(`Error fetching responsives: ${error}`);
  }
}


async function updateResponsiveStatusJob() {
  const responsives = await responsiveFileController.getAllResponsiveFiles();
  responsives.forEach((responsive) => {
    postgreSQLUpdateResponsiveNotficationsState(responsive.resp_id);
  });
}

async function deleteAuditLogFiles() {
  const auditLogs = await auditLogController.getAllAuditLogs();
  auditLogs.forEach((auditLog) => {
    console.log("Se elimina respfile: ", auditLog.file_id_fk);
    responsiveFileController.deleteResponsiveFile(auditLog.file_id_fk);
  });
}

function initializeScheduler() {
  console.log("Start notification");
  const [hour, minute] = process.env.NOTIFICATION_TIME.split(":").map(Number);
  const mexicoCityTimeZone = "America/Mexico_City";
  const scheduleNotTimeRule = new schedule.RecurrenceRule();
  scheduleNotTimeRule.hour = hour;
  scheduleNotTimeRule.minute = minute;
  scheduleNotTimeRule.tz = mexicoCityTimeZone;

  const scheduleUpdateNotStatus = new schedule.RecurrenceRule();
  scheduleUpdateNotStatus.hour = hour;
  scheduleUpdateNotStatus.minute = minute + 1;
  scheduleUpdateNotStatus.tz = mexicoCityTimeZone;

  const scheduleDeleteAuditLogs = new schedule.RecurrenceRule();
  scheduleDeleteAuditLogs.dayOfWeek = 0;
  scheduleDeleteAuditLogs.hour = 12;
  scheduleDeleteAuditLogs.minute = 9;
  scheduleDeleteAuditLogs.tz = mexicoCityTimeZone;

  schedule.scheduleJob(scheduleNotTimeRule, job);
  schedule.scheduleJob(scheduleUpdateNotStatus, updateResponsiveStatusJob);
  schedule.scheduleJob(scheduleDeleteAuditLogs, deleteAuditLogFiles);
  console.log("Jobs scheduled successfully.");
}

module.exports = initializeScheduler;
