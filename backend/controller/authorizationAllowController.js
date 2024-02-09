const { Sequelize } = require("sequelize");
const db = require("../config/database/sequelize");
const AuthorizationRequest = require("../model/authorizationRequestModel");

const insertAuthAllow = async (authAllowData) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const result = await AuthAllow.create(authAllowData);
    return result;
  } catch (error) {
    console.error("Error inserting authAllowData", error);
    return error;
  }
};

const updateAuthAllow = async (authAllowId, newAuthAllowData) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findByPk(authAllowId);
    if (authAllow) {
      await authAllow.update(newAuthAllowData);
      return authAllow;
    }
  } catch (error) {
    console.error("Error updating user", error);
    return error;
  }
};

const deleteAuthAllow = async (userId) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findByPk(userId);
    if (authAllow) {
      await authAllow.destroy();
      return true;
    } else {
      console.error("authAllow not found");
      return false;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    return error;
  }
};

const getAllAuthAllow = async () => {
  try {
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findAll();
    return authAllow;
  } catch (error) {
    console.error("Error retrieving users", error);
    return error;
  }
};

const getAuthAllow = async (authAllowId) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findByPk(userId);
    if (authAllow) {
      return authAllow;
    } else {
      console.error("authAllow not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving authAllow", error);
    return error;
  }
};

const getAuthAllowByUserId = async (userId) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findAll({
      where: {
        user_id_fk: userId,
      },
    });
    if (authAllow) {
      // Perform inner join manually
      const AuthRequest = db.authorizationRequest;
      const authRequestIds = authAllow.map((allow) => allow.request_id_fk);
      const authRequests = await AuthRequest.findAll({
        where: {
          request_id: authRequestIds,
        },
      });

      // Merge the results
      const result = authAllow.map((allow) => {
        const relatedRequest = authRequests.find(
          (request) => request.request_id === allow.request_id_fk
        );
        return {
          ...allow.toJSON(),
          AuthorizationRequest: relatedRequest.toJSON(),
        };
      });

      return result;
    } else {
      console.error("authAllow not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving authAllow", error);
    return error;
  }
};

const getAllAuthAllowByRequestId = async (requestId) => {
  try{
    const AuthAllow = db.authorizationAllow;
    const authAllow = await AuthAllow.findAll({
      where: {
        request_id_fk: requestId,
      },
    });
    return authAllow;
  } catch(error){
    console.error("Error retrieving authAllow", error);
    return error;
  }
}

module.exports = {
  insertAuthAllow,
  updateAuthAllow,
  getAllAuthAllow,
  getAuthAllow,
  getAuthAllowByUserId,
  getAllAuthAllowByRequestId,
};
