require("dotenv").config();
const globals = require("../config/globalVariables");
const bcrypt = require("bcrypt");
const { searchUserLDAP } = require("./authenticationService");
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

// Function to initialize values in the PostgreSQL database
async function postgreSQLInitValuesDB() {
  const db = require("../config/database/sequelize"); 

  try {
    // Create an Admin User
    const User = db.user; 
    const adminUser = await User.findOne({
      where: {
        email: "pmxresp@outlook.com", // Look for the admin user by email
      },
    });
    globals.adminUser = adminUser; // Store the admin user in a global variable

    // If the admin user does not exist, create it
    if (!adminUser) {
      const salt = process.env.PMXRESP_SALT; 
      const hash = await bcrypt.hash("s0port3+Adm1n", salt); 
      const result = await User.create({
        email: "pmxresp@outlook.com",
        name: "SoporteAdmin", 
        pswrd: hash, 
        user_type_id_fk: 2, 
        is_active: true, 
      });
      console.log("Created a new admin account ", result.email);
      globals.adminUser = result; // Store the new admin user in a global variable
    }

    // Update status of previous admin users
    const oldAdmins = await User.findAll({
      where: {
        user_type_id_fk: 2, // Look for all users with admin type
      },
    });
    oldAdmins.forEach(async (oldAdmin) => {
      if (oldAdmin.email != "pmxresp@outlook.com") {
        await oldAdmin.update({
          user_type_id_fk: 1, // Change user type to non-admin
          is_active: false, // Deactivate the user
        });
      }
    });

    // Insert additional admin users from environment variable
    const emailAdminsString = process.env.ADMINS; 

    if (emailAdminsString && emailAdminsString.trim() !== "") {
      const emailList = emailAdminsString.split(","); // Split the email string into an array
      emailList.forEach(async (email) => {
        try {
          const userInfo = await searchUserLDAP(email); // Search for users info in LDAP
          if (userInfo) {
            console.log("LDAP user found", userInfo.attributes.displayName);
            const userAdminFromList = await User.findOne({
              where: {
                email: userInfo.attributes.mail, // Look for the user by email in db
              },
            });
            //If user found in db update status if not create it
            if (userAdminFromList) {
              await userAdminFromList.update({
                name: userInfo.attributes.displayName, // Update user info
                user_type_id_fk: 2, // Set user type to admin
                is_active: true, // Activate the user
              });
            } else {
              await User.create({
                email: userInfo.attributes.mail, // Create new user
                name: userInfo.attributes.displayName,
                user_type_id_fk: 2, // Set user type to admin
                is_active: true, // Activate the user
              });
            }
          } else {
            console.log("User with email: ", email, "couldn't be found in the active directory");
          }
        } catch (err) {
          console.log("Error while searching for user: ", email);
        }
      });
    }

    // Notification Data Configuration
    const NotificationData = db.notificationData; 
    const notifData = await NotificationData.findOne({
      where: { notif_data_id: 1 }, // Look for existing notification data
    });
    if (!notifData) {
      await NotificationData.destroy({ truncate: true }); // Remove all existing records
      const result = await NotificationData.create({
        bot_id: "6668462504:AAFvARrWQyU1gUhiTpsEcM74y4oPxHMMOqo", // Bot ID
        chat_group_id: "-1001612435955", // Chat group ID
        notification_time: "12:00", // Notification time
      });
      console.log("Removed all records and created new record with ID ", result.notif_data_id, " and bot: ", result.bot_id);
    }
  } catch (err) {
    console.error("Error: ", err); // Log any errors
  }
}

  /*
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
  */


// Call the functions
module.exports = {
  postgreSQLUpdateResponsiveNotficationsState,
  postgreSQLInitValuesDB,
};
