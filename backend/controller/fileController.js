const db = require("../config/database/sequelize");

const insertFile = async (fileData) => {
    try {
      const Files = db.files;
      const results = await Files.create(fileData);
      return results;
    } catch (error) {
      console.log("Error", error);
      return error;
    }
  };

  const updateFileByRespIDFK = async (respID, newFileData) => {
    try {
      const Files = db.files;
      const file = await Files.findOne({
        where: {
          resp_id_fk: respID,
        },
      });
      if (file) {
        await file.update(newFileData);
        return file;
      }
    } catch (error) {
      console.log("Error updating user", error);
      return error;
    }
  };

  const updateFile = async (fileID, newFileData) => {
    try {
      const Files = db.files;
      const file = await Files.findByPk(fileID);
      if (file) {
        await file.update(newResponsiveData);
        return file;
      }
    } catch (error) {
      console.log("Error updating user", error);
      return error;
    }
  };
  
  const deleteFile = async (fileID) => {
    try {
      const Files = db.files;
      const file = await Files.findByPk(fileID);
      if (file) {
        await file.destroy();
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
  
  const getAllFiles = async () => {
    try {
      const Files = db.files;
      const files = await Files.findAll();
      return files;
    } catch (error) {
      console.log("Error retrieving Responsive Files", error);
      return error;
    }
  };
  
  const getFile = async (responsiveID) => {
    try {
      const Files = db.files;
      const file = await Files.findByPk(responsiveID);
      if (file) {
        return file;
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
    insertFile,
    updateFile,
    updateFileByRespIDFK,
    deleteFile,
    getAllFiles,
    getFile
  }