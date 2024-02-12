import axios from "axios";

const apiBase = "https://pmx-resp.onrender.com";
//const apiBase = "http://localhost:8080";
const apiURL = `${apiBase}/pmx-resp`;
const bearerToken = localStorage.getItem("jwt");

/**
 * Responsive
 */

const apiResponsiveURI = "/responsive-file";
export const postResponsive = (responsiveData) => {
  return axios
    .post(`${apiURL}${apiResponsiveURI}`, responsiveData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error", error);
      return { error: "Network error" };
    });
};

export const putResponsive = (responsiveID, newResponsiveData) => {
  return axios
    .put(`${apiURL}${apiResponsiveURI}/${responsiveID}`, newResponsiveData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

export const getResponsive = (responsiveID) => {
  return axios
    .get(`${apiURL}${apiResponsiveURI}/${responsiveID}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const getAllResponsive = () => {
  return axios
    .get(`${apiURL}${apiResponsiveURI}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

export const deleteResponsive = (responsiveID) => {
  return axios
    .delete(`${apiURL}${apiResponsiveURI}/${responsiveID}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server error" };
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

/**
 * Users
 */

const apiUsersURI = "/users";
export const postUser = (responsiveData) => {
  return axios
    .post(`${apiURL}${apiUsersURI}`, responsiveData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error", error);
      return { error: "Network error" };
    });
};

export const putUser = (responsiveID, newResponsiveData) => {
  return axios
    .put(`${apiURL}${apiUsersURI}/${responsiveID}`, newResponsiveData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

export const getUser = (responsiveID) => {
  return axios
    .get(`${apiURL}${apiUsersURI}/${responsiveID}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const getAllUsers = () => {
  return axios
    .get(`${apiURL}${apiUsersURI}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

export const deleteUser = (responsiveID) => {
  return axios
    .delete(`${apiURL}${apiUsersURI}/${responsiveID}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return {
          error: "Server error",
        };
      }
    })
    .catch((error) => {
      console.log("Error");
      console.log("RESPUESTA:", error.response);
      if (error.response.status === 404) {
        return {
          error:
            "Error: Contacte con soporte para eliminar al usuario o revise el manual de usuario",
        };
      } else {
        return { error: "Server error" };
      }
    });
};

/**
 * Responsive File
 */

const apiFileURI = "/responsive-file/pdf";
export const getFile = (fileID) => {
  return axios
    .get(`${apiURL}${apiFileURI}/${fileID}`, {
      responseType: "blob",
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const getFileData = (fileData) => {
  return axios
    .post(`${apiURL}${apiFileURI}/data`, fileData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

/**
 * Authorization Allow
 */

const apiAuthAllowURI = "/authallow";
export const getAllAuthAllowByUser = () => {
  return axios
    .get(`${apiURL}${apiAuthAllowURI}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const updateAuthAllow = (authAllowId, authAllowData) => {
  return axios
    .put(`${apiURL}${apiAuthAllowURI}/${authAllowId}`, authAllowData)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server error" };
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

/**
 * Authorization Requests
 */

const apiAuthRequestURI = "/authrequest";
export const getAllAuthRequestData = () => {
  return axios
    .get(`${apiURL}${apiAuthRequestURI}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

export const deleteAuthRequest = (id) => {
  return axios
    .delete(`${apiURL}${apiAuthRequestURI}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data; // Only return data for successful responses
      } else {
        return { error: "Server error" }; // You can customize this for error responses
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
    });
};

/**
 * Email Notify
 */

const apiEmailNotifyURI = "/email-notify";
export const postEmailNotify = (emailNotifyData) => {
  return axios
    .post(`${apiURL}${apiEmailNotifyURI}`, { data: emailNotifyData })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    });
};

export const getAllEmailNotify = () => {
  return axios.get(`${apiURL}${apiEmailNotifyURI}`).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: "Server Error" };
    }
  });
};

export const deleteEmailNotify = (id) => {
  return axios
    .delete(`${apiURL}${apiEmailNotifyURI}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    });
};

/**
 * Login
 */

const loginURI = "/login";

export const postLogin = (loginData) => {
  return axios
    .post(`${apiBase}${loginURI}`, loginData)
    .then((response) => {
      if (response.status === 200) {
        console.log("200 ERR");
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        console.log("404 ERR");
        return { error: "Usuario no Encontrado" };
      } else {
        return { error: "Server Error" };
      }
    });
};

const verifyTokenURI = "/verify-token";

export const verifyToken = (token) => {
  return axios
    .get(`${apiBase}${verifyTokenURI}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    });
};

/**
 * Notifications
 */

const notificationURI = "/notification";
const botURI = "/bot";

export const verifyTelegramToken = async (ttoken) => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${ttoken}/getMe`
    );
    if (response.data && response.data.ok) {
      // Token is valid
      const botInfo = response.data.result;
      console.log("Bot username:", botInfo.username);
      console.log("Bot ID:", botInfo.id);
      return true;
    } else {
      // Token is invalid
      console.error("Invalid Telegram bot token");
      return false;
    }
  } catch (error) {
    // Error occurred (e.g., network error)
    console.error("Error validating Telegram bot token:", error.message);
    return false;
  }
};

export const putNotificationBot = (notificationData) => {
  return axios
    .put(`${apiURL}${notificationURI}${botURI}`, notificationData, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error " };
      }
    })
    .catch((error) => {
      return { error: `Server Error ${error}` };
    });
};

export const getNotificationBot = () => {
  return axios
    .get(`${apiURL}${notificationURI}${botURI}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    });
};

/**
 * AuditLog
 */

const apiAuditLogURI = "/auditlog";
const fileRestoreURI = "/file-restore";
export const getAllAuditLogs = () => {
  return axios.get(`${apiURL}${apiAuditLogURI}`).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: "Server Error" };
    }
  });
};

export const postRestoreFileAuthReq = (id) => {
  return axios
    .post(`${apiURL}${apiAuditLogURI}${fileRestoreURI}/${id}`)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return { error: "Server Error" };
      }
    });
};
