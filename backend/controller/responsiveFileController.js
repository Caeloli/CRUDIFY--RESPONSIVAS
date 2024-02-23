const countResponsiveFilesStatus = async () => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;
    const results = await ResponsiveFiles.findAll();
    return results;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const insertResponsiveFile = async (responsiveData) => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;
    const results = await ResponsiveFiles.create(responsiveData);
    return results;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const updateResponsiveFile = async (responsiveID, newResponsiveData) => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;
    const responsiveFile = await ResponsiveFiles.findByPk(responsiveID);
    if (responsiveFile) {
      await responsiveFile.update(newResponsiveData);
      return responsiveFile;
    }
  } catch (error) {
    console.log("Error updating user", error);
    return error;
  }
};

const deleteResponsiveFile = async (responsiveID) => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;
    const responsiveFile = await ResponsiveFiles.findByPk(responsiveID);
    if (responsiveFile) {
      await responsiveFile.destroy();
      return true;
    } else {
      console.error("Responsive File not found");
      return false;
    }
  } catch (error) {
    console.log("Error deleting Responsive File", error);
    return error;
  }
};

const getAllResponsiveFiles = async () => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;
    const responsiveFiles = await ResponsiveFiles.findAll();
    return responsiveFiles;
  } catch (error) {
    console.log("Error retrieving Responsive Files", error);
    return error;
  }
};

const getResponsiveFile = async (responsiveID) => {
  const db = require("../config/database/sequelize");
  try {
    const ResponsiveFiles = db.responsiveFiles;

    const responsiveFile = await ResponsiveFiles.findByPk(responsiveID);
    if (responsiveFile) {
      return responsiveFile;
    } else {
      console.error("Responsive File not found");
      return null;
    }
  } catch (error) {
    console.log("Error retrieving Responsive File", error);
    return error;
  }
};

module.exports = {
  countResponsiveFilesStatus,
  insertResponsiveFile,
  updateResponsiveFile,
  getAllResponsiveFiles,
  getResponsiveFile,
  deleteResponsiveFile,
};
