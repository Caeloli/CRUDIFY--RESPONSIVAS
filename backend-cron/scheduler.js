const schedule = require("node-schedule");
const { DateTime } = require("luxon");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { default: axios } = require("axios");
const { text, response } = require("express");
const backendPostgresql = "http://pmxresp-backend-service";
//const backendPostgresql =
  //process.env.PMXRESP_BACKEND_SERVICE_SERVICE_HOST ?? "http://localhost";
const frontendDir = "http://pmxresp-frontend-service";
//const frontendDir =
  //process.env.PMXRESP_FRONTEND_SERVICE_SERVICE_HOST ?? "http://localhost:3000";
const backendDir = "/pmx-resp";
const backendNotification = "http://pmxresp-notifications-service";
//const backendNotification =
//  process.env.PMXRESP_NOTIFICATIONS_SERVICE_SERVICE_HOST ??  "http://localhost:10333";
let notificationSchedule;
// Define an asynchronous function for a job
async function job() {
  console.log("Notification Job Started...");

  // Step 1: Get all responsive files
  // Step 2: Filter them based on certain conditions
  // Step 3: Generate text for notifications
  // Step 4: Send notifications to Telegram
  // Step 5: Get all users
  // Step 6: Send notifications to all users

  try {
    // Login to get authentication token
    const loginResponse = await axios.post(`${backendPostgresql}/login`, {
      user: "pmxresp@outlook.com",
      password: "s0port3+Adm1n",
    });
    const token = loginResponse.data;

    // Get all responsive files
    const responsives = await axios.get(
      `${backendPostgresql}${backendDir}/responsive-file`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    /* 
    const file = await axios.get(`${backendPostgresql}${backendDir}/responsive-file/pdf/85`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    */

    // Get all users
    const users = await axios.get(`${backendPostgresql}${backendDir}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get notification data
    const notifData = await axios.get(
      `${backendPostgresql}${backendDir}/notification/bot`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Get user servers
    const serverUsers = await axios.get(
      `${backendPostgresql}${backendDir}/user-servers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const currentDate = new Date();

    // Filter responsive files based on certain conditions
    const filteredResponsives = responsives.data.filter((responsive) => {
      const endDateDiff =
        (new Date(responsive.end_date) - currentDate) / (1000 * 60 * 60 * 24); // Difference in days
      return (
        endDateDiff <= 30 &&
        Math.ceil(endDateDiff) >= 0 &&
        (responsive.state_id_fk === 2 || responsive.state_id_fk === 4) &&
        [30, 20, 10, 1].includes(Math.ceil(endDateDiff)) //Filter depending on 30, 20, 10 and 1 days.
      );
    });

    // Perform inner join between filtered responsives and user servers
    const responsiveFullData = filteredResponsives.map((responsive) => {
      const serverUser = serverUsers.data.find(
        (user) => user.user_server_id === responsive.user_servers_id_fk
      );
      return { ...responsive, serverUser };
    });

    // Map users' email addresses
    const emailUsers = users.data.map((user) => user.email);

    // Send notifications via email and Telegram
    console.log("Notification Sending...");
    responsiveFullData.forEach((responsive) => {
      console.log("Sending responsive: ", responsive.resp_id);
      const text =
        `🔔 NOTIFICACIÓN RESPONSIVA ${responsive.resp_id}\n\n` +
        ` **Usuario:** ${responsive.serverUser.user_server_username}\n` +
        ` **Correo:** ${responsive.serverUser.email}\n` +
        ` **Teléfono:** ${responsive.serverUser.phone}\n` +
        ` **Jefe Inmediato:** ${responsive.serverUser.immediately_chief}\n` +
        ` **Fecha Final:** ${responsive.end_date.split("T")[0]}\n` +
        ` **URL:** ${frontendDir}/${
          responsive.file_format === 3 ? "FilesThirdForm" : "FilesFourthForm"
        }/${responsive.resp_id}\n`;

      // Send email notifications to all users
      axios.post(`${backendNotification}/send-email`, {
        to: emailUsers,
        subject: `Notificación Responsiva: ${responsive.resp_id}`,
        text: text,
      });

      // Send email notification to the specific server user
      axios.post(`${backendNotification}/send-email`, {
        to: responsive.serverUser.email,
        subject: `Notificación a Usuario ${responsive.serverUser.user_server_username}`,
        text: `La responsiva correspondiente al registro con número de ${responsive.remedy}, vigente desde ${responsive.start_date} hasta ${responsive.end_date}, se encuentra próxima a expirar. Se recomienda tomar las medidas necesarias para su renovación a fin de mantener la continuidad operativa. Si tiene alguna pregunta o requiere asistencia adicional, no dude en ponerse en contacto con el equipo responsable. ¡Gracias por su atención!`,
      });

      // Send Telegram message to the group
      axios.post(`${backendNotification}/send-tmessage`, {
        chatID: notifData.data.chat_group_id,
        text: text,
      });

      // Update the state of the responsive file
      const formData = new FormData();
      const data = { resp_id: responsive.resp_id, state_id_fk: 4 };
      formData.append("data", JSON.stringify(data));
      axios.put(
        `${backendPostgresql}${backendDir}/responsive-file/${responsive.resp_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data",
          },
        }
      );
    });
  } catch (error) {
    console.log("Error", error);
  }
}

// Define an asynchronous function for updating responsive status job
async function updateResponsiveStatusJob() {
  console.log("Updates on status jobs...");

  // Login to get authentication token
  const loginResponse = await axios.post(`${backendPostgresql}/login`, {
    user: "pmxresp@outlook.com",
    password: "s0port3+Adm1n",
  });
  const token = loginResponse.data;

  // Get all responsive files
  const responsives = (
    await axios.get(`${backendPostgresql}${backendDir}/responsive-file`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;

  // Get all states
  const states = (
    await axios.get(`${backendPostgresql}${backendDir}/states`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;

  /**
   * State IDs and their meanings:
   * 1 "active"
   * 2 "notify"
   * 3 "expired"
   * 4 "notified"
   * 5 "cancelled"
   * 6 "renovated"
   */

  // Map and filter responsives to update their states
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
          responsive.state_id_fk = 3; // Expired
        }
      } else {
        if (daysDifference > 30) {
          if (responsive.state_id_fk === 1) return; // Active
          responsive.state_id_fk = 1; // Set to active
        } else if (daysDifference <= 30 && daysDifference >= 0) {
          if (responsive.state_id_fk === 2) return; // Notify
          responsive.state_id_fk = 2; // Set to notify
        } else {
          if (responsive.state_id_fk === 3) return; // Expired
          responsive.state_id_fk = 3; // Set to expired
        }
      }
      return responsive;
    })
    .filter((responsive) => responsive != undefined);

  // Update the state of each responsive file
  responsivesUpdate.forEach((responsive) => {
    const formData = new FormData();
    const data = responsive;
    formData.append("data", JSON.stringify(data));
    axios.put(
      `${backendPostgresql}${backendDir}/responsive-file/${responsive.resp_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      }
    );
  });
}

// Initialize the scheduler for periodic jobs
async function initializeScheduler() {
  try {
    // Authenticate and get token
    const loginResponse = await axios.post(`${backendPostgresql}/login`, {
      user: "pmxresp@outlook.com",
      password: "s0port3+Adm1n",
    });
    const token = loginResponse.data;

    // Get notification data
    const notifResponse = await axios.get(
      `${backendPostgresql}${backendDir}/notification/bot`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { notification_time } = notifResponse.data;
    const [hour, minute, second] = notification_time.split(":").map(Number);

    // Define schedule rule
    const mexicoCityTimeZone = "America/Mexico_City";
    const scheduleNotifTimeRule = new schedule.RecurrenceRule();
    scheduleNotifTimeRule.hour = hour;
    scheduleNotifTimeRule.minute = minute;
    scheduleNotifTimeRule.second = second; 
    scheduleNotifTimeRule.tz = mexicoCityTimeZone;

    // Schedule job
    notificationSchedule = schedule.scheduleJob(
      scheduleNotifTimeRule,
      async function () {
        try {
          await job();
          await updateResponsiveStatusJob();
        } catch (error) {
          console.error("Error executing scheduled jobs:", error);
        }
      }
    );

    console.log("Jobs scheduled successfully at ", hour, ":", minute);
  } catch (error) {
    console.error("Error initializing scheduler:", error);
  }
}

// Stop the scheduler
function stopScheduler() {
  if (!!notificationSchedule) {
    notificationSchedule.cancel();
  }
  console.log("Scheduler stopped.");
}

// Restart the scheduler
function restartScheduler() {
  stopScheduler();
  initializeScheduler();
  console.log("Scheduler restarted.");
}

module.exports = {
  initializeScheduler,
  restartScheduler,
};
