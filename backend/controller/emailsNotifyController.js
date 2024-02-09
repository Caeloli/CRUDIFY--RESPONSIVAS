const db = require("../config/database/sequelize");

const insertEmailNotify = async (emailNotifyData) => {
    try {
      const EmailsNotify = db.emailsNotify;
      const result = await EmailsNotify.create(emailNotifyData);
      return result;
    } catch (error) {
      console.error("Error inserting email notify", error);
      return error;
    }
  };
  
  const updateEmailNotify = async (emailNotifyId, newEmailNotifyData) => {
    try {
      const EmailsNotify = db.emailsNotify;
      const emailNotify = await EmailsNotify.findByPk(emailNotifyId);
      if (emailNotify) {
        await emailNotify.update(newEmailNotifyData);
        return emailNotify;
      }
    } catch (error) {
      console.error("Error updating email notify", error);
      return error;
    }
  };
  
  const deleteEmailNotify = async (emailNotifyId) => {
    try {
      const EmailsNotify = db.emailsNotify;
      const emailNotify = await EmailsNotify.findByPk(emailNotifyId);
      if (emailNotify) {
        await emailNotify.destroy();
        return true;
      } else {
        console.error("Email notify not found");
        return false;
      }
    } catch (error) {
      console.error("Error deleting email notify", error);
      return error;
    }
  };
  
  const getAllEmailsNotify = async () => {
    try {
      const EmailsNotify = db.emailsNotify;
      const emailsNotify = await EmailsNotify.findAll();
      return emailsNotify;
    } catch (error) {
      console.error("Error retrieving emails notify", error);
      return error;
    }
  };
  
  const getEmailNotify = async (emailNotifyId) => {
    try {
      const EmailsNotify = db.emailsNotify;
      const emailNotify = await EmailsNotify.findByPk(emailNotifyId);
      if (emailNotify) {
        return emailNotify;
      } else {
        console.error("Email notify not found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving email notify", error);
      return error;
    }
  };
  
  module.exports = {
    insertEmailNotify,
    updateEmailNotify,
    deleteEmailNotify,
    getAllEmailsNotify,
    getEmailNotify,
  };
  