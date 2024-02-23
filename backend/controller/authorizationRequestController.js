const insertAuthRequest = async (authRequestData) => {
  const db = require("../config/database/sequelize");
  try {
    const AuthRequest = db.authorizationRequest;
    const result = await AuthRequest.create(authRequestData);
    return result;
  } catch (error) {
    console.error("Error inserting user", error);
    return error;
  }
};

const updateAuthRequest = async (authRequestId, newAuthRequestData) => {
  const db = require("../config/database/sequelize");
  try {
    const AuthRequest = db.authorizationRequest;
    const authRequest = await AuthRequest.findByPk(authRequestId);
    if (authRequest) {
      await authRequest.update(newAuthRequestData);
      return authRequest;
    }
  } catch (error) {
    console.error("Error updating user", error);
    return error;
  }
};

const deleteAuthRequest = async (userId) => {
  const db = require("../config/database/sequelize");
  try {
    const AuthRequest = db.authorizationRequest;
    const authRequest = await AuthRequest.findByPk(userId);
    if (authRequest) {
      await authRequest.destroy();
      return true;
    } else {
      console.error("AuthRequest not found");
      return false;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    return error;
  }
};

const getAllAuthRequest = async () => {
  const db = require("../config/database/sequelize");
  try {
    const AuthRequest = db.authorizationRequest;
    const authRequest = await AuthRequest.findAll();
    return authRequest;
  } catch (error) {
    console.error("Error retrieving users", error);
    return error;
  }
};

const getAuthRequest = async (requestId) => {
  const db = require("../config/database/sequelize");
  try {
    const AuthRequest = db.authorizationRequest;
    const authRequest = await AuthRequest.findByPk(requestId);
    if (authRequest) {
      return authRequest;
    } else {
      console.error("AuthRequest not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user", error);
    return error;
  }
};

module.exports = {
  insertAuthRequest,
  updateAuthRequest,
  getAuthRequest,
  getAllAuthRequest,
  deleteAuthRequest,
};
