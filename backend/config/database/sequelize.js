const { Sequelize } = require("sequelize");
const { dbConfigData } = require("./db");
const { postgreSQLInitValuesDB } = require("../../services/dbServices");
//const { startBot } = require("../../services/bot/tbot");
//const initializeScheduler = require("../../services/schedule/scheduler");

const sequelize = new Sequelize(
  dbConfigData.database,
  dbConfigData.user,
  dbConfigData.password,
  //"postgres://pmrresp_super:DQNOjK3ZIKpAMOeEgO9zYalIsqPeuAOx@dpg-cn5117tjm4es73br72jg-a.oregon-postgres.render.com/pmrresp",
  {
    host: dbConfigData.host,
    dialect: "postgres",
    /*
    dialectOptions: {
      ssl: {
        require: true, // Set to true to require SSL
        rejectUnauthorized: false, // Set to false if using self-signed certificates
      },
      */

    /*logging: false,
    native: false,
    */
  }
);

sequelize.authenticate();

const db = {};
(async () => {
  db.sequelize = await sequelize;
  db.userType = await require("../../model/userTypeModel")(sequelize);
  db.user = await require("../../model/usersModel")(sequelize);
  db.actions = await require("../../model/actionModel")(sequelize);
  db.auditLog = await require("../../model/auditLogModel")(sequelize);
  db.userServer = await require("../../model/userServersModel")(sequelize);
  db.responsiveFiles = await require("../../model/responsiveFileModel")(
    sequelize
  );
  db.states = await require("../../model/statesModel")(sequelize);
  db.authorizationAllow = await require("../../model/authorizationAllowModel")(
    sequelize
  );
  db.authorizationRequest =
    await require("../../model/authorizationRequestModel")(sequelize);
  db.files = await require("../../model/fileModel")(sequelize);
  db.servers = await require("../../model/serversModel")(sequelize);
  db.emailsNotify = await require("../../model/emailsNotifyModel")(sequelize);
  await postgreSQLInitValuesDB();
})();

module.exports = db;
