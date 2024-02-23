const db = require("../config/database/sequelize");

const insertAuditLog = async (auditLogData) => {
  const db = require("../config/database/sequelize");
  try {
    const AuditLog = db.auditLog;
    const results = await AuditLog.create(auditLogData);
    return results;
  } catch (error) {
    console.error("Error inserting audit log", error);
    return error;
  }
};

const updateAuditLog = async (userId, newUserData) => {
  const db = require("../config/database/sequelize");
  try {
    const AuditLog = db.auditLog;
    const auditlog = await AuditLog.findByPk(userId);
    if (auditlog) {
      await auditlog.update(newUserData);
      return auditlog;
    }
  } catch (error) {
    console.error("Error updating user", error);
    return error;
  }
};

const deleteAuditLog = async (userId) => {
  const db = require("../config/database/sequelize");
  try {
    const AuditLog = db.auditLog;
    const auditlog = await AuditLog.findByPk(userId);
    if (auditlog) {
      await auditlog.destroy();
      return true;
    } else {
      console.error("AuditLog not found");
      return false;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    return error;
  }
};

const getAllAuditLogs = async () => {
  const db = require("../config/database/sequelize");
  try {
    const AuditLog = db.auditLog;
    const auditlogs = await AuditLog.findAll();
    return auditlogs;
  } catch (error) {
    console.error("Error retrieving auditlogs", error);
    return error;
  }
};

const getAuditLog = async (auditLogId) => {
  const db = require("../config/database/sequelize");
  try {
    const AuditLog = db.auditLog;
    const auditLog = await AuditLog.findByPk(auditLogId);
    if (auditLog) {
      return auditLog;
    } else {
      console.error("User not found");
      return null;
    }
  } catch(error){
    console.error("Error retrieving user", error);
    return error;
  }
}

module.exports = {
  deleteAuditLog,
  getAllAuditLogs,
  getAuditLog,
  insertAuditLog,
  updateAuditLog,
};
