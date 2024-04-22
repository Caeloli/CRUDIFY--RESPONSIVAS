const express = require("express");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../config/database/sequelize");
const responsiveFileController = require("../controller/responsiveFileController");
const serverController = require("../controller/serversController");
const userServerController = require("../controller/userServerController");
const fileController = require("../controller/fileController");
const userController = require("../controller/usersController");
const authAllowController = require("../controller/authorizationAllowController");
const authReqController = require("../controller/authorizationRequestController");
const emailNotifyController = require("../controller/emailsNotifyController");
const notificationServices = require("../services/axiosServices/notificationServices");
const auditLogController = require("../controller/auditLogController");
const notificatioDataController = require("../controller/notificationDataController");
const authServices = require("../services/authServices");
const responsiveServices = require("../services/responsiveServices");
const utils = require("../utils/functions");
//const {
//  updateTelegramBotToken,
//  updateTelegramChatId,
//  updateNotificationTime,
//} = require("../config");
//const { sendNotification, startBot } = require("../services/bot/tbot");

const {
  postgreSQLUpdateResponsiveNotficationsState,
} = require("../services/dbServices");
const globals = require("../config/globalVariables");
const { error, log } = require("console");
const { default: axios } = require("axios");

//const responsiveFileModel = require("../model/responsivefile.model")
const salt = process.env.SALT;
//responsivefile.model.js
//router.post("/crfile", responsiveFileModel.createResponsiveFile);
//router.put("/urfile", responsiveFileModel.updateResponsiveFile);
//router.get("/grfile", responsiveFileModel.readResponsiveFile);
//router.get("/garfile", responsiveFileModel.readAllResponsiveFiles)
//router.delete("/drfile", responsiveFileModel.deleteResponsiveFile);

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "responsive"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: memoryStorage });

/**
 * UserTypes
 */


router.get("/usertype", async (req, res) => {
  try {
    const UserType = db.userType;
    const results = await UserType.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with user_types" });
  }
});

/**
 * Users
 */

router.post("/users", async (req, res) => {
  try {
    console.log("SALT: ", salt);
    const data = req.body;
    const { pswrd } = data;
    console.log("DATA: ", data);
    console.log("PSWRD: ", pswrd);
    const hash = await bcrypt.hash(pswrd, salt);
    const userStored = userController.insertUser({ ...data, pswrd: hash });
    return res.status(200).json({
      message: `User uploaded successfully with ID: ${userStored.user_id}`,
    });
  } catch (error) {
    console.log("Error uploading user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const results = await userController.getAllUsers();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with users" });
  }
});

/*router.put("/users/restore", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userController.getUserByEmail(email);
    if (user) {
      const newPassword = generatePassword.generate({
        length: Math.floor(Math.random() * 11) + 9,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true,
        excludeSimilarCharacters: true,
      });
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await userController.updateUser(user.user_id, {
        pswrd: hashedPassword,
      });
      if (updatedUser) {
        const backendNotification = "http://localhost:10333";
        axios
          .post(`${backendNotification}/send-email`, {
            to: updatedUser.email,
            subject: "Recuperación y Actualización de Contraseña",
            text: `Su contraseña para el correo electrónico ${updatedUser.email} ha sido actualizada a ${updatedUser.pswrd}. Por favor, verifique sus credenciales.`,
          })
          .then(() => {
            res.status(200).json({ message: "Password updated successfully" });
          })
          .catch(async (error) => {
            await userController.updateUser(user.user_id, {
              pswrd: user.pswrd,
            });
            console.error("Error sending email: ", error);
            res
              .status(500)
              .json({ message: "Failed to send email notification" });
          });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error restoring user:", error);
    res
      .status(500)
      .json({ message: "Internal server error with restoring user" });
  }
}); */

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userController.getUser(id);
    if (user.user_type_id_fk === 1) {
      const userDeleted = await userController.deleteUser(id);
      return res.status(200).json({
        message: `User deleted successfully with ID: ${userDeleted.user_id}`,
      });
    } else {
      return res.status(404).json({
        message: `Contact some technical for deleting the user from database: ${user.user_id}`,
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with actions" });
  }
});

/**
 * Actions
 */

router.get("/actions", async (req, res) => {
  try {
    const Actions = db.actions;
    const results = await Actions.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with actions" });
  }
});

/**
 * Audit Log
 */

router.get("/auditlog", async (req, res) => {
  try {
    const auditLogs = await auditLogController.getAllAuditLogs();
    return res.json(auditLogs);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with auditlog" });
  }
});

router.put("/auditlog", async (req, res) => {
  try {
    const data = req.body;
    const auditLog = await auditLogController.updateAuditLog(data);
    return res.json(auditLog);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with auditlog" });
  }
});

/*router.post("/auditlog/file-restore/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const auditLog = await auditLogController.getAuditLog(id);

    const updatedResponsiveFile =
      await responsiveFileController.updateResponsiveFile(auditLog.file_id_fk, {
        state_id_fk: 1,
      });
    await postgreSQLUpdateResponsiveNotficationsState(
      updatedResponsiveFile.resp_id
    );

    const deletedAuditLog = await auditLogController.deleteAuditLog(id);

    return res
      .status(200)
      .json({ message: `AuditLog ${id} restored and deleted` });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error while restoring file" });
  }
});
*/
/**
 * Responsive Files
 */

router.post("/responsive-file", upload.single("file"), async (req, res) => {
  /**
   * Retrieve Data
   * Check if there's a before(renew) or after responsive ID
   *    If there's a before responsive ID
   *       Check if that responsive doesn't have an already after_responsive
   *          If it does -> error
   *    If there's an after responsive ID
   *       Check if that responsive doesn't have an already before_responsive
   *          If it does -> error
   * Check if user is new or exists
   * If it's new
   *    Store new User
   *    Store responsive
   *    Store servers
   *    Store file
   * Else
   *    Look for old User
   *    Store responsive
   *    Store servers
   *    Store file
   * Return to client result
   */

  try {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const user_id = req.user_id;
    if (!!data.after_responsive_id || !!data.before_responsive_id) {
      if (data.after_responsive_id) {
        if (
          await responsiveServices.checkIfThereIsBeforeRespID(
            data.after_responsive_id
          )
        ) {
          throw Error(
            `Responsive with ID ${data.after_resp_id} is renovation of another responsive`
          );
        }
      }
      if (data.before_responsive_id) {
        if (
          await responsiveServices.checkIfThereIsAfterRespID(
            data.before_responsive_id
          )
        ) {
          throw Error(
            `Responsive with ID ${data.before_resp_id} has a renovation already`
          );
        }
      }
    }

    let userServersResult;
    //Data is new user 1, new user is going to be inserted
    if (data.is_new_user === 1) {
      userServersResult = await userServerController.insertUserServer({
        user_server_username: data.user_name,
        email: data.email,
        token: data.token,
        phone: data.phone,
        immediately_chief: data.immediately_chief,
        immediately_chief_email: data.email_immediately_chief,
      });
    }
    //Data is new user 2, previous user is gonna be retrieve
    else if (data.is_new_user === 2) {
      userServersResult = await userServerController.getUserServer(
        data.user_name
      );
    } else {
      throw error;
    }
    const renewedResponsive = data.before_responsive_id
      ? await responsiveFileController.getResponsiveFile(
          data.before_responsive_id
        )
      : null;
    const nextResponsive = data.after_responsive_id
      ? await responsiveFileController.getResponsiveFile(
          data.after_responsive_id
        )
      : null;

    const responsiveResult =
      await responsiveFileController.insertResponsiveFile({
        user_id_fk: user_id,
        user_servers_id_fk: userServersResult.user_server_id,
        remedy: data.remedy,
        start_date: data.start_date,
        end_date: data.end_date,
        file_format: data.file_format,
        before_resp_id_fk: renewedResponsive?.resp_id ?? null,
        after_resp_id_fk: nextResponsive?.resp_id ?? null,
      });

    if (renewedResponsive) {
      responsiveFileController.updateResponsiveFile(renewedResponsive.resp_id, {
        state_id_fk: 6,
        after_resp_id_fk: responsiveResult.resp_id,
      });
    }

    const fileResult = await fileController.insertFile({
      file_original_name: file.originalname,
      file_unique_name: utils.generateUniqueFileName(file.originalname),
      resp_id_fk: responsiveResult.resp_id,
      file_content: file.buffer,
    });

    const insertServersF3 = async () => {
      for (const server of data.servers) {
        const serverStored = await serverController.insertServer({
          hostname: server.hostname,
          domain_server: server.domain_server,
          ip_address: server.ip_address,
          responsive_file_id_fk: responsiveResult.resp_id,
        });
        // Handle serverStored if needed
      }
    };

    const insertServersF4 = async () => {
      for (const server of data.servers) {
        const serverStored = await serverController.insertServer({
          brand: server.brand,
          model: server.model,
          serial_number: server.serial_number,
          location: server.location,
          responsive_file_id_fk: responsiveResult.resp_id,
        });
        // Handle serverStored if needed
      }
    };

    if (data.servers.length > 0) {
      if (data.file_format === 3) await insertServersF3();
      else if (data.file_format === 4) await insertServersF4();
    }
    return res.status(200).json({
      message: `File uploaded successfully with ID: `,
      //${responsiveFileStored.resp_id}
    });
  } catch (error) {
    console.log("Error uploading file", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/responsive-file/:id", upload.single("file"), async (req, res) => {
  try {
    /**
     * Receive data (responsive, userServer, servers)
     * Check if responsive exists
     *    If exists -> continue;
     *    else -> error;
     * If responsive exists, check format
     *    If format changes -> Error
     *    else -> continue
     *
     * If state_id_fk = 5 => Update in db and return
     *
     * Check is userServers is a new user or an existent user
     *  if is new -> insert new user and get id
     *  else -> get existent user and get id
     * Check if file is undefined
     *  if file is undefined -> continue;
     *  else -> update file
     * Update data from responsive
     *
     * Delete previous servers
     * Insert new servers
     * return successful
     *
     */

    console.log("Se llama a data update");
    const id = req.params.id;
    const file = req.file;
    console.log("req: ", req.body.data);
    const data = JSON.parse(req.body.data);
    console.log("DATA UPDATE: ", data);
    console.log("FILE UPDATE: ", file);
    const user_id = req.user_id;

    const responsiveResult = await responsiveFileController.getResponsiveFile(
      data.resp_id
    );

    if (!responsiveResult) {
      throw new Error("Responsive file does not exist.");
    }

    if (!!data.state_id_fk) {
      if (data.state_id_fk === 5) {
        const result = await responsiveFileController.updateResponsiveFile(
          responsiveResult.resp_id,
          data
        );
        return res.status(200).json({
          message: `Responsive cancelled with ID: ${result.resp_id}`,
          //${responsiveFileStored.resp_id}
        });
      } else if(data.state_id_fk === 4){
        const result = await responsiveFileController.updateResponsiveFile(
          responsiveResult.resp_id,
          data
        );
        return res.status(200).json({
          message: `Responsive updated to notified with ID: ${result.resp_id}`,
          //${responsiveFileStored.resp_id}
        });
      }
    }

    if (responsiveResult.file_format !== data.file_format) {
      throw new Error("File format cannot be changed.");
    }

    if (!!data.after_responsive_id || !!data.before_responsive_id) {
      if (
        data.after_responsive_id &&
        data.after_responsive_id !== responsiveResult.after_resp_id_fk
      ) {
        if (
          await responsiveServices.checkIfThereIsBeforeRespID(
            data.after_responsive_id
          )
        ) {
          throw Error(
            `Responsive with ID ${data.after_resp_id} is a renovation of another responsive`
          );
        }
      }
      if (
        data.before_responsive_id &&
        data.before_responsive_id !== responsiveResult.before_resp_id_fk
      ) {
        if (
          await responsiveServices.checkIfThereIsAfterRespID(
            data.before_responsive_id
          )
        ) {
          throw Error(
            `Responsive with ID ${data.before_resp_id} has already been renovated`
          );
        }
      }
    }

    let userServersResult;
    if (data.is_new_user === 1) {
      userServersResult = await userServerController.insertUserServer({
        user_server_username: data.user_name,
        email: data.email,
        token: data.token,
        phone: data.phone,
        immediately_chief: data.immediately_chief,
        immediately_chief_email: data.email_immediately_chief,
      });
    } else if (data.is_new_user === 2) {
      userServersResult = await userServerController.getUserServer(
        data.user_name
      );
    } else {
      throw new Error("Invalid user status.");
    }

    if (file) {
      await fileController.updateFileByRespIDFK(responsiveResult.resp_id, {
        file_original_name: file.originalname,
        file_unique_name: utils.generateUniqueFileName(file.originalname),
        file_content: file.buffer,
      });
    }

    //Update before and after responsive_id from OLD responsives
    console.log("ResponsiveFilesdasdsaads: ", responsiveResult);
    if (!!responsiveResult.before_resp_id_fk)
      console.log("SE ACTUALIZA EL BEFORE");
    responsiveFileController.updateResponsiveFile(
      responsiveResult.before_resp_id_fk,
      {
        after_resp_id_fk: null,
      }
    );
    if (!!responsiveResult.after_resp_id_fk)
      responsiveFileController.updateResponsiveFile(
        responsiveResult.after_resp_id_fk,
        {
          before_resp_id_fk: null,
        }
      );

    await responsiveFileController.updateResponsiveFile(
      responsiveResult.resp_id,
      {
        user_id_fk: user_id,
        user_servers_id_fk: userServersResult.user_server_id,
        remedy: data.remedy,
        start_date: data.start_date,
        end_date: data.end_date,
        file_format: responsiveResult.file_format,
        after_resp_id_fk: data.after_responsive_id,
        before_resp_id_fk: data.before_responsive_id,
      }
    );

    //Update before and after responsive_id from NEW responsives
    if (!!data.before_responsive_id)
      responsiveFileController.updateResponsiveFile(data.before_responsive_id, {
        after_resp_id_fk: responsiveResult.resp_id,
      });
    if (!!data.after_responsive_id)
      responsiveFileController.updateResponsiveFile(data.after_responsive_id, {
        before_resp_id_fk: responsiveResult.resp_id,
      });

    const servers = await serverController.getServersByRespIDFK(
      responsiveResult.resp_id
    );

    servers.forEach((server) => {
      serverController.deleteServer(server.server_id);
    });

    data.servers.forEach((server) => {
      if (responsiveResult.file_format === 3)
        serverController.insertServer({
          hostname: server.hostname,
          domain_server: server.domain_server,
          ip_address: server.ip_address,
          responsive_file_id_fk: responsiveResult.resp_id,
        });
      else if (responsiveResult.file_format === 4) {
        serverController.insertServer({
          brand: server.brand,
          model: server.model,
          serial_number: server.serial_number,
          location: server.location,
          responsive_file_id_fk: responsiveResult.resp_id,
        });
      }
    });

    return res.status(200).json({
      message: `Responsive updated with ID: ${responsiveResult.resp_id}`,
      //${responsiveFileStored.resp_id}
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with responsivefiles" });
  }
});

router.get("/responsive-file/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const responsiveFile = await responsiveFileController.getResponsiveFile(id);

    if (responsiveFile) {
      const servers = await serverController.getServersByRespIDFK(
        responsiveFile.resp_id
      );
      const usersServers = await userServerController.getUserServer(
        responsiveFile.user_servers_id_fk
      );
      const serversArray = servers.map((server) => server.dataValues);
      return res.json({
        ...responsiveFile.dataValues,
        servers: serversArray || [],
        ...usersServers.dataValues,
      });
    } else {
      return res.status(404).json({
        message: "Responsive File not found",
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with responsivefiles" });
  }
});

router.get("/responsive-file", async (req, res) => {
  try {
    const responsiveFiles =
      await responsiveFileController.getAllResponsiveFiles();
    return res.json(responsiveFiles);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with responsivefiles" });
  }
});

router.delete("/responsive-file/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Actualizas estado de resposniva para eliminar

    const responsiveFile = await responsiveFileController.updateResponsiveFile(
      id,
      {
        state_id_fk: 5,
      }
    );
    //Genera instancia en auditlog
    await auditLogController.insertAuditLog({
      file_id_fk: responsiveFile.resp_id,
      user_id_fk: globals.adminUser.user_id, //modify_user_id
      action_id_fk: 3,
      date: new Date().getTime(),
    });

    // En scheduler se debe eliminar la responsiva
    /*const responsiveFile = await responsiveFileController.deleteResponsiveFile(
      id
    );*/
    return res.status(200).json({
      message: `File deleted successfully with ID: ${responsiveFile.resp_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with responsivefiles" });
  }
});

/**
 * States
 */

router.get("/states", async (req, res) => {
  try {
    const States = db.states;
    const results = await States.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with states" });
  }
});

/**
 * Authorization Allow
 */

router.get("/authallow", async (req, res) => {
  try {
    const AuthAllow = db.authorizationAllow;
    const results = await AuthAllow.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authAllow" });
  }
});

router.put("/authallow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const authAllow = await authAllowController.updateAuthAllow(id, data);
    console.log("AuthAllow con boolean: ", authAllow.is_allowed);
    await authServices.checkAuthRequest(authAllow.request_id_fk);
    return res.status(200).json({
      message: `AuthAllow updated successfully with ID: ${authAllow.allow_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authAllow" });
  }
});

router.get("/authallow/user", utils.verifyToken, async (req, res) => {
  try {
    const authAllow = await authAllowController.getAuthAllowByUserId(
      req.user_id
    );
    console.log(authAllow);
    return res.status(200).json(authAllow);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest" });
  }
});
/**
 * Authorization Request
 */

router.get("/authrequest", async (req, res) => {
  try {
    const authRequests = await authReqController.getAllAuthRequest();
    return res.json(authRequests);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest" });
  }
});

router.put("/authrequest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const authRequest = await authReqController.updateAuthRequest(id, data);
    return res.status(200).json({
      message: `File uploaded successfully with ID: ${authRequest.request_id}`,
    });
  } catch (error) {}
});

router.delete("/authrequest/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authRequest = await authReqController.deleteAuthRequest(id);
    return res.status(200).json({
      message: `File deleted successfully with ID: ${authRequest.request_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with email-notify" });
  }
});

/**
 * Register
 */

router.post("/authrequest/register", async (req, res) => {
  try {
    const { affected_email, affected_type, chat_id } = req.body;
    const authRequest = await authReqController.insertAuthRequest({
      user_id_fk: globals.adminUser.user_id,
      action_id_fk: 1,
      request_date: new Date().getTime(),
      affected_email: affected_email,
      affected_type: affected_type,
      chat_id: chat_id,
    });
    return res.status(200).json({
      message: `Post authRequest successfully with ID: ${authRequest.request_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest register" });
  }
});

/**
 * Servers
 */

router.post("/servers", async (req, res) => {
  try {
    const data = req.body.data;
    const server = await serverController.insertServer(data);
    return res.status(200).json({
      message: `Server successfully inserted with ID: ${server.server_id}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while inserting Servers",
    });
  }
});

router.get("/servers", async (req, res) => {
  try {
    const servers = await serverController.getAllServers();
    return res.status(200).json(servers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error with User Servers" });
  }
});

/**
 * User Servers
 */

router.post("/user-servers", async (req, res) => {
  try {
    const data = req.body.data;
    const userServer = await userServerController.insertUserServer(data);
    return res.status(200).json({
      message: `User Server successfully inserted with ID: ${userServer.user_server_id}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error with User Servers" });
  }
});

router.get("/user-servers", async (req, res) => {
  try {
    const userServers = await userServerController.getAllUserServer();
    return res.json(userServers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error with userServers" });
  }
});

/**
 * PDF Store
 */

router.get("/responsive-file/pdf/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("El ID es:", id);
    const file = await fileController.getFileByRespIDFK(id);
    if (file) {
      console.log("El file es:", file);
      console.log("El contenido del archivo es. ", file.file_content);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.file_original_name}"`
      ); // Optionally, specify filename for download

      // Send file content as response
      res.send(file.file_content);
    } else {
      return res.status(404).json({
        message: "Responsive File not found",
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with responsivefiles" });
  }
});

router.post(
  "/responsive-file/pdf/data",
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      const { formatData } = JSON.parse(req.body.data);
      console.log("File is: ", file);
      console.log("Data is: ", formatData);
      const result = await utils.getDataFromPDF(formatData, file);

      const userServer = await userServerController.getUserServerByName(
        result.user_name
      );
      if (userServer) {
        result.user_server_id = userServer.user_server_id;
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log("Error", error);
      return res
        .status(500)
        .json({ message: "Internal server error with responsivefiles" });
    }
  }
);

router.get("/notification/bot", async (req, res) => {
  try {
    const notifData = await notificatioDataController.getNotificationData(1);
    return res.status(200).json({
      bot_id: notifData.bot_id,
      chat_group_id: notifData.chat_group_id,
      notification_time: notifData.notification_time,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with Notification Bot" });
  }
});

router.put("/notification/bot", async (req, res) => {
  try {
    const data = req.body;
    const notifData = await notificatioDataController.updateNotificationData(
      1,
      data
    );
    if (!!data.bot_id && !!notifData) {
      notificationServices.restartBotTelegram();
      //const backendNotification = "http://localhost:10333";
      //axios.post(`${backendNotification}/restart-bot`);
    }
    if (!!data.notification_time && !!notifData) {
      notificationServices.restartScheduler();
      //const backendScheduler = "http://localhost:10335";
      //axios.post(`${backendScheduler}/restart-scheduler`);
    }
    res.status(200).json({ message: `Variable ${data} actualizado con éxito` });
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "Internal server error with Notification Bot" });
  }
});

/*router.get("/file/:id", async(req, res) => {
  try{
    const id = req.params.id;
    const file = await fileController.getFileByRespIDFK(id);
    file.file_unique_name;
    file.file_content;
  } catch(error){
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "Internal server error with Files" });
  }
});

/*router.use(
  "/files",
  express.static(path.join(__dirname, "../uploads/responsive"))
); 
*/

module.exports = router;
