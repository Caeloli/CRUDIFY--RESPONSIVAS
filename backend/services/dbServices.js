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
    /*const tbotUser = await User.findOne({
      where: {
        email: "tbot@telegram.com",
      },
    });
    if (!tbotUser) {
      const salt = process.env.SALT;
      const hash = await bcrypt.hash("tbotTelegra+10", salt);
      const result = await User.create({
        email: "tbot@telegram.com",
        pswrd: hash,
        user_type_id_fk: 1,
      });
      console.log("Crear una nueva cuenta de tbot");
    }
    */
    const adminUser = await User.findOne({
      where: {
        email: "admin@admin.com",
      },
    });
    globals.adminUser = adminUser;
    if (!adminUser) {
      const salt = process.env.SALT;
      const hash = await bcrypt.hash("s0port3+Adm1n", salt);
      const result = await User.create({
        email: "admin@admin.com",
        pswrd: hash,
        user_type_id_fk: 2,
      });
      console.log("Crea una nueva cuenta de admin");
      globals.adminUser = result;
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
