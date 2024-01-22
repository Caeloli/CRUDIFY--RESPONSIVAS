import axios from "axios";

const apiURL = "http://localhost:4000/pmx-resp";

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
        return { error: "Server error" };
      }
    })
    .catch((error) => {
      console.log("Error");
      return error;
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
