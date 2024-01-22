const db = require("../config/database/sequelize");

const insertUser = async (userData) => {

  try {
    const User = db.user;
    const result = await User.create(userData);
    return result;
  } catch (error) {
    console.error("Error inserting user", error);
    return error;
  }
};

const updateUser = async (userId, newUserData) => {
  try {
    const User = db.user;
    const user = await User.findByPk(userId);
    if (user) {
      await user.update(newUserData);
      return user;
    }
  } catch (error) {
    console.error("Error updating user", error);
    return error;
  }
};

const deleteUser = async (userId) => {
  try {
    const User = db.user;
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      return true;
    } else {
      console.error("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    return error;
  }
};

const getAllUsers = async () => {
  try {
    const User = db.user;
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error retrieving users", error);
    return error;
  }
};

const getUser = async (userId) => {
  try {
    const User = db.user;
    const user = await User.findByPk(userId);
    if (user) {
      return user;
    } else {
      console.error("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user", error);
    return error;
  }
};

module.exports = {
  insertUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
};
