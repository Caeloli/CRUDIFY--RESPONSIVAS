const insertUserServer = async (userServerData) => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const results = await UserServer.create(userServerData);
    return results;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateUserServer = async (userServerID, newUserServerData) => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const userServer = await UserServer.findByPk(userServerID);
    if (userServer) {
      await userServer.update(newUserServerData);
      return userServer;
    }
  } catch (error) {
    console.log("Error updating user", error);
    return error;
  }
};

const deleteUserServer = async (userServerID) => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const userServer = await UserServer.findByPk(userServerID);
    if (userServer) {
      await userServer.destroy();
      return true;
    } else {
      console.error("userServer not found");
      return false;
    }
  } catch (error) {
    console.log("Error deleting userServer", error);
    return error;
  }
};

const getAllUserServer = async () => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const userServer = await UserServer.findAll();
    return userServer;
  } catch (error) {
    console.log("Error retrieving User Server", error);
    return error;
  }
};

const getUserServer = async (userServerID) => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const userServer = await UserServer.findByPk(userServerID);
    if (userServer) {
      return userServer;
    } else {
      console.error("User Server not found");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving User Server", error);
    return error;
  }
};

const getUserServerByName = async (userServerName) => {
  const db = require("../config/database/sequelize");
  try {
    const UserServer = db.userServer;
    const userServer = await UserServer.findOne({
      where: {
        user_server_username: userServerName,
      },
    });
    if (userServer) {
      return userServer;
    } else {
      console.error("User Server not found");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving User Server", error);
    return error;
  }
};

module.exports = {
  deleteUserServer,
  getAllUserServer,
  getUserServer,
  getUserServerByName,
  insertUserServer,
  updateUserServer,
};
