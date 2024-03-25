const db = require("../config/database/sequelize");

const insertServer = async (serverData) => {
    try {
      const Servers = db.servers;
      const results = await Servers.create(serverData);
      return results;
    } catch (error) {
      console.log("Error", error);
      return error;
    }
  };

  const updateServerByRespIDFK = async (respID, newServerData) => {
    try {
      const Servers = db.servers;
      const server = await Servers.findOne({
        where: {
          responsive_file_id_fk: respID,
        },
      });
      if (server) {
        await server.update(newServerData);
        return server;
      }
    } catch (error) {
      console.log("Error updating user", error);
      return error;
    }
  };

  const updateServer = async (serverID, newServerData) => {
    try {
      const Servers = db.servers;
      const server = await Servers.findByPk(serverID);
      if (server) {
        await server.update(newServerData);
        return server;
      }
    } catch (error) {
      console.log("Error updating user", error);
      return error;
    }
  };
  
  const deleteServer = async (serverID) => {
    try {
      const Servers = db.servers;
      const server = await Servers.findByPk(serverID);
      if (server) {
        await server.destroy();
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
  
  const getAllServers = async () => {
    try {
      const Servers = db.servers;
      const servers = await Servers.findAll();
      return servers;
    } catch (error) {
      console.log("Error retrieving Responsive Files", error);
      return error;
    }
  };
  
  const getServer = async (serverID) => {
    try {
      const Servers = db.servers;
      const servers = await Servers.findByPk(serverID);
      if (servers) {
        return servers;
      } else {
        console.error("Responsive File not found");
        return null;
      }
    } catch (error) {
      console.log("Error retrieving Responsive File", error);
      return error;
    }
  };

  const getServersByRespIDFK = async (responsiveID) => {
    try {
        const Servers = db.servers;
        const servers = await Servers.findAll({
            where: {
              responsive_file_id_fk: responsiveID,
            },
          });
          
        if (servers) {
          return servers;
        } else {
          console.error("Responsive File not found");
          return false;
        }
      } catch (error) {
        console.log("Error deleting Responsive File", error);
        return error;
      }
  }

  module.exports = {
    insertServer,
    updateServer,
    updateServerByRespIDFK,
    getServer,
    getServersByRespIDFK,
    getAllServers,
    deleteServer
  }