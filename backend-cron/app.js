const schedule = require("node-schedule");
const { DateTime } = require("luxon");
require('dotenv').config();
const path = require("path");
const fs = require("fs");
//const responsiveFileController = require("../../controller/responsiveFileController");
//const auditLogController = require("../../controller/auditLogController");
//const { sendNotification } = require("../bot/tbot");
//const {
//  postgreSQLUpdateResponsiveNotficationsState,
//} = require("../dbServices");
//const { checkExpirationDates } = require("../fileServices");
const { default: axios } = require("axios");
const { text, response } = require("express");
//const url_name = "http://172.19.70.21:30203/pmx-resp/files/";

const backendPostgresql = "http://localhost";
const backendDir = "/pmx-resp";
const backendNotification = "http://localhost:10333";

async function job() {
  console.log("Notification sending...");
  //Get all Responsives
  //Filter them
  //Generate text
  //Send notification to telegram
  //Get All Users
  //Send notification to all users

  try {
    const loginResponse = await axios.post(`${backendPostgresql}/login`, {
      user: "admin@admin.com",
      password: "s0port3+Adm1n",
    });
    const token = loginResponse.data;
    const responsives = await axios.get(
      `${backendPostgresql}${backendDir}/responsive-file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const users = await axios.get(`${backendPostgresql}${backendDir}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const serverUsers = await axios.get(
      `${backendPostgresql}${backendDir}/user-servers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    //Filter Responsives
    const filteredResponsives = responsives.data.filter((responsive) => {
      const endDateDiff =
        (responsive.end_date - currentDate) / (1000 * 60 * 60 * 24); // Difference in days
      return (
        endDateDiff <= 30 && endDateDiff >= 0 && responsive.state_id_fk === 2
      );

      //return responsive.resp_id === 44;
    });

    // Perform inner join between filtered responsives and user servers
    const responsiveFullData = filteredResponsives.map((responsive) => {
      const serverUser = serverUsers.data.find(
        (user) => user.user_server_id === responsive.user_servers_id_fk
      );
      return { ...responsive, serverUser };
    });

    const emailUsers = users.data.map((user) => user.email);
    //Email notifications

    responsiveFullData.forEach((responsive) => {
      const text =
        `🔔 NOTIFICACIÓN RESPONSIVA ${responsive.resp_id}\n\n` +
        ` **Usuario:** ${responsive.serverUser.user_server_username}\n` +
        ` **Correo:** ${responsive.serverUser.email}\n` +
        ` **Teléfono:** ${responsive.serverUser.phone}\n` +
        ` **Jefe Inmediato:** ${responsive.serverUser.immediately_chief}\n` +
        ` **Fecha Final:** ${responsive.end_date.split("T")[0]}\n` +
        ` **URL:** ${backendPostgresql}\n`;

      axios.post(`${backendNotification}/send-email`, {
        to: emailUsers,
        subject: `Notificación Responsiva: ${responsive.resp_id}`,
        text: text,
      });
      axios.post(`${backendNotification}/send-tmessage`, {
        chatID: -1001612435955,
        text: text,
      });
    });

    const responsiveUpdate = responsiveFullData.map((responsive) => {
      responsive.state_id_fk = 4;
      return responsive;
    });
  } catch (error) {
    console.log("Error", error);
  }

  /*try {
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
  */
}

async function updateResponsiveStatusJob() {
  console.log("Updates on status jobs...");
  const loginResponse = await axios.post(`${backendPostgresql}/login`, {
    user: "admin@admin.com",
    password: "s0port3+Adm1n",
  });
  const token = loginResponse.data;
  const responsives = (
    await axios.get(`${backendPostgresql}${backendDir}/responsive-file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
  /*const states = (
    await axios.get(`${backendPostgresql}${backendDir}/states`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;

  const responsiveData = responsives.map((responsive) => {
    const statesData = states.find(
      (state) => state.state_id === responsive.state_id_fk
    );
    return { ...responsive, statesData };
  });
  */

  /**
   * 1	"active"
   * 2	"notify"
   * 3	"expired"
   * 4	"notified"
   * 5	"cancelled"
   * 6	"renovated"
   */
  const responsivesUpdate = responsives
    .map((responsive) => {
      if (responsive.state_id_fk === 5 || responsive.state_id_fk === 6) {
        return;
      }
      const endDate = new Date(responsive.end_date);
      const currentDate = new Date();
      const daysDifference = Math.floor(
        (endDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (responsive.state_id_fk === 4) {
        if (daysDifference < 0) {
          responsive.state_id_fk = 3;
        }
      } else {
        if (daysDifference > 30) {
          if (responsive.state_id_fk === 1) return;
          responsive.state_id_fk = 1;
        } else if (daysDifference <= 30 && daysDifference >= 0) {
          if (responsive.state_id_fk === 2) return;
          responsive.state_id_fk = 2;
        } else {
          if (responsive.state_id_fk === 3) return;
          responsive.state_id_fk = 3;
        }
      }
      return responsive;
    })
    .filter((responsive) => responsive != undefined);

  responsivesUpdate.forEach((responsive) => {
    axios.put(
      `${backendPostgresql}${backendDir}/responsive_file/${responsive.resp_id}`,
      responsive,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });
}

/*
async function deleteAuditLogFiles() {
  const auditLogs = await auditLogController.getAllAuditLogs();
  auditLogs.forEach((auditLog) => {
    responsiveFileController.deleteResponsiveFile(auditLog.file_id_fk);
  });
}
*/
function initializeScheduler() {
  const [hour, minute] = process.env.NOTIFICATION_TIME.split(":").map(Number);
  const mexicoCityTimeZone = "America/Mexico_City";
  const scheduleNotifTimeRule = new schedule.RecurrenceRule();
  scheduleNotifTimeRule.hour = hour;
  scheduleNotifTimeRule.minute = minute;
  scheduleNotifTimeRule.tz = mexicoCityTimeZone;

  const scheduleUpdateNotStatus = new schedule.RecurrenceRule();
  scheduleUpdateNotStatus.hour = hour;
  scheduleUpdateNotStatus.minute = minute + 10;
  scheduleUpdateNotStatus.tz = mexicoCityTimeZone;

  //const scheduleDeleteAuditLogs = new schedule.RecurrenceRule();
  //scheduleDeleteAuditLogs.dayOfWeek = 0;
  //scheduleDeleteAuditLogs.hour = 12;
  //scheduleDeleteAuditLogs.minute = 9;
  //scheduleDeleteAuditLogs.tz = mexicoCityTimeZone;

  schedule.scheduleJob(scheduleNotifTimeRule, job);
  schedule.scheduleJob(scheduleUpdateNotStatus, updateResponsiveStatusJob);
  //schedule.scheduleJob(scheduleDeleteAuditLogs, deleteAuditLogFiles);
  console.log("Jobs scheduled successfully.");
}


initializeScheduler();