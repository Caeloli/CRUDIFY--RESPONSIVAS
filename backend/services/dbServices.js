const db = require("../config/database/sequelize"); // Import Sequelize instance

// Call a PostgreSQL function
async function postgreSQLUpdateResponsiveNotficationsState(resp_id) {
  try {
    const sequelize = db.sequelize;
    const result = await sequelize.query("SELECT verify_responsive_files_state(:param1)", {
      replacements: { param1: resp_id },
      type: sequelize.QueryTypes.SELECT,
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the functions
module.exports = {
  postgreSQLUpdateResponsiveNotficationsState,
};
