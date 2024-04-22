
const insertNotificationData = async (notifData) => {
    const db = require("../config/database/sequelize");
    try {
      const NotificationData = db.notificationData;
      const result = await NotificationData.create(notifData);
      return result;
    } catch (error) {
      console.error("Error inserting NotifData", error);
      return error;
    }
  };
  
  const updateNotificationData = async (notifDataId, newNotifData) => {
    const db = require("../config/database/sequelize");
    try {
      const NotificationData = db.notificationData;
      const notifData = await NotificationData.findByPk(notifDataId);
      if (notifData) {
        await notifData.update(newNotifData);
        return notifData;
      }
    } catch (error) {
      console.error("Error updating NotifData", error);
      return error;
    }
  };
  
  const deleteNotificationData = async (notifDataId) => {
    const db = require("../config/database/sequelize");
    try {
      const NotificationData = db.notificationData;
      const notifData = await NotificationData.findByPk(notifDataId);
      if (notifData) {
        await notifData.destroy();
        return true;
      } else {
        console.error("NotifData not found");
        return false;
      }
    } catch (error) {
      console.error("Error deleting NotifData", error);
      return error;
    }
  };
  
  const getNotificationData = async (notifDataId) => {
    const db = require("../config/database/sequelize");
    try {
      const NotificationData = db.notificationData;
      const notifData = await NotificationData.findByPk(notifDataId);
      if (notifData) {
        return notifData;
      } else {
        console.error("NotifData not found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving NotifData", error);
      return error;
    }
  };
  
  module.exports = {
    insertNotificationData,
    updateNotificationData,
    deleteNotificationData,
    getNotificationData
  };
  