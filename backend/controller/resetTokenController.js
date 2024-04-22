const insertResetToken = async (resetTokenData) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
    try {
      const result = await ResetToken.create(resetTokenData);
      return result;
    } catch (error) {
      console.error("Error inserting ResetToken", error);
      return error;
    }
  };
  
  const updateResetToken = async (resetTokenId, newResetTokenData) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
  
    try {
      const resetToken = await ResetToken.findByPk(resetTokenId);
      if (resetToken) {
        await resetToken.update(newResetTokenData);
        return resetToken;
      }
    } catch (error) {
      console.error("Error updating ResetToken", error);
      return error;
    }
  };
  
  const deleteResetToken = async (resetTokenId) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
  
    try {
      const resetToken = await ResetToken.findByPk(resetTokenId);
      if (resetToken) {
        await resetToken.destroy();
        return true;
      } else {
        console.error("ResetToken not found");
        return false;
      }
    } catch (error) {
      console.error("Error deleting ResetToken", error);
      return error;
    }
  };
  
  const getResetToken = async (resetTokenId) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
  
    try {
      const resetToken = await ResetToken.findByPk(resetTokenId);
      if (resetToken) {
        return resetToken;
      } else {
        console.error("ResetToken not found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving ResetToken", error);
      return error;
    }
  };

  const getAllResetToken = async () => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
  
    try {
      const resetTokens = await ResetToken.findAll();
      return resetTokens;
    } catch (error) {
      console.error("Error retrieving all ResetTokens", error);
      return error;
    }
  };

  const getAllResetTokenByResetToken = async (resetToken) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
    try{
      const resetTokens = await ResetToken.findAll({
        where: {
          reset_token: resetToken,
        }
      })
      return resetTokens;
    } catch(error){
      console.error("Error retrieving all ResetTokens", error)
      return error;
    }
  }

  const getAllResetTokenByUserId = async (userId) => {
    const db = require("../config/database/sequelize");
    const ResetToken = db.resetToken;
    try {
        const resetTokens = await ResetToken.findAll({
          where: { user_id_fk: userId }
        });
        return resetTokens;
    } catch(error){
        console.error("Error retrieving ResetToken", error);
      return error;
    }
  }
  
  module.exports = {
    insertResetToken,
    updateResetToken,
    deleteResetToken,
    getResetToken,
    getAllResetToken,
    getAllResetTokenByUserId,
    getAllResetTokenByResetToken,
  };
  