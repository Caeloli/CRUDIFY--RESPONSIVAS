const { Sequelize } = require("sequelize");
const { dbConfigData } = require("./db");

const sequelize = new Sequelize(
  dbConfigData.database,
  dbConfigData.user,
  dbConfigData.password,
  {
    host: dbConfigData.host,
    dialect: "postgres",
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
  db.responsiveFiles = await require("../../model/responsiveFileModel")(sequelize);
  db.states = await require("../../model/statesModel")(sequelize);
  db.authorizationAllow = await require("../../model/authorizationAllowModel")(sequelize);
  db.authorizationRequest = await require("../../model/authorizationRequestModel")(sequelize);
  db.files = await require("../../model/fileModel")(sequelize);
  db.servers = await require("../../model/serversModel")(sequelize);
})();
module.exports = db;
