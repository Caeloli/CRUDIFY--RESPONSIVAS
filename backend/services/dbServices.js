require("dotenv").config();
const globals = require("../config/globalVariables");

const bcrypt = require("bcrypt");
// Call a PostgreSQL function
async function postgreSQLUpdateResponsiveNotficationsState(resp_id) {
  const db = require("../config/database/sequelize"); // Import Sequelize instance
  try {
    const sequelize = db.sequelize;
    const result = await sequelize.query(
      "SELECT verify_responsive_files_state(:param1)",
      {
        replacements: { param1: resp_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

async function postgreSQLInitValuesDB() {
  const db = require("../config/database/sequelize"); // Import Sequelize instance
  try {
    const User = db.user;
    const adminUser = await User.findOne({
      where: {
        email: "pmxresp@outlook.com",
      },
    });
    globals.adminUser = adminUser;
    if (!adminUser) {
      const salt = process.env.SALT;
      const hash = await bcrypt.hash("s0port3+Adm1n", salt);
      const result = await User.create({
        email: "pmxresp@outlook.com",
        pswrd: hash,
        user_type_id_fk: 2,
      });
      console.log("Crea una nueva cuenta de admin ", result.email);
      globals.adminUser = result;
    }

    const NotificationData = db.notificationData;
    const notifData = await NotificationData.findOne({ where: { notif_data_id: 1 } });
    if (!notifData) {
      await NotificationData.destroy({ truncate: true });
      const result = await NotificationData.create({
        bot_id: "6668462504:AAFvARrWQyU1gUhiTpsEcM74y4oPxHMMOqo",
        chat_group_id: "-1001612435955",
        notification_time: '12:00', // Make sure to wrap the time value in quotes
      });
      console.log("Eliminando todos los registros y creando registro nuevo ", result.notif_data_id, " con bot: ", result.bot_id);
    }
    
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Call the functions
module.exports = {
  postgreSQLUpdateResponsiveNotficationsState,
  postgreSQLInitValuesDB,
};
