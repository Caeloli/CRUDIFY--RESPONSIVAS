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
const fileController = require("../controller/fileController");
const userController = require("../controller/usersController");
const authAllowController = require("../controller/authorizationAllowController");
const authReqController = require("../controller/authorizationRequestController");
const emailNotifyController = require("../controller/emailsNotifyController");
const auditLogController = require("../controller/auditLogController");

const authServices = require("../services/authServices");
const utils = require("../utils/functions");
const {
  updateTelegramBotToken,
  updateTelegramChatId,
  updateNotificationTime,
} = require("../config");
const { sendNotification, startBot } = require("../services/bot/tbot");
const initializeScheduler = require("../services/schedule/scheduler");
const {
  postgreSQLUpdateResponsiveNotficationsState,
} = require("../services/dbServices");

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

router.get("/", (req, res) => {
  res.send("HelloWold");
});

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

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userController.getUser(id);
    console.log("USRR: ", user);
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

router.post("/auditlog/file-restore/:id", async (req, res) => {
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
/**
 * Responsive Files
 */

router.post("/responsive-file", upload.single("file"), async (req, res) => {
  try {
    //Retrieve of data
    const file = req.file;
    const data = req.body.data;
    console.log("File es: ", file);
    console.log("Data es: ", data);
    //Save file in path
    const filePath = path.join(__dirname, "..", "uploads", "responsive");
    //Code of unique name of file
    const uniqueName = utils.generateUniqueFileName(file.originalname);
    fs.writeFileSync(path.join(filePath, uniqueName), file.buffer);

    const { resp_id, ...fileDataWithoutRespId } = JSON.parse(data);
    const responsiveFileStored =
      await responsiveFileController.insertResponsiveFile({
        ...fileDataWithoutRespId,
        file_route: path.join(filePath, uniqueName),
        user_id_fk: 1,
      });

    const { servers } = JSON.parse(data);
    const insertServers = async () => {
      for (const server of servers) {
        const serverStored = await serverController.insertServer({
          server_name: server.windows_server,
          account: server.account,
          domain: server.domain,
          responsive_file_id_fk: responsiveFileStored.resp_id,
        });
        // Handle serverStored if needed
      }
    };
    if (servers.length > 0) {
      await insertServers();
    }
    /*const serverStored = await serverController.insertServer({
      ...JSON.parse(data),
      resp_id_fk: responsiveFileStored.resp_id,
    });
    */

    const fileData = {
      file_original_name: file.originalname,
      file_unique_name: uniqueName,
      resp_id_fk: responsiveFileStored.resp_id,
    };

    const fileDataStored = await fileController.insertFile(fileData);

    return res.status(200).json({
      message: `File uploaded successfully with ID: ${responsiveFileStored.resp_id}`,
    });
  } catch (error) {
    console.log("Error uploading file", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/responsive-file/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const file = req.file;
    const data = JSON.parse(req.body.data);
    console.log("El id es:", id);
    console.log("El file es:", file);
    console.log("DATA ES: ", data);
    // Get existing responsive file
    const responsiveFile = await responsiveFileController.getResponsiveFile(id);

    // Save the old PDF route for later deletion
    const oldPdfRoute = responsiveFile.file_route;

    if (file) {
      // Create and save the updated file
      const filePath = path.join(__dirname, "..", "uploads", "responsive");
      const uniqueName = utils.generateUniqueFileName(file.originalname);
      fs.writeFileSync(path.join(filePath, uniqueName), file.buffer);

      // Update file data in the database
      const fileData = {
        file_original_name: file.originalname,
        file_unique_name: uniqueName,
        resp_id_fk: responsiveFile.resp_id,
      };
      const fileDataStored = await fileController.updateFileByRespIDFK(
        responsiveFile.resp_id,
        fileData
      );
      // Update responsive file data
      const responsiveFileStored =
        await responsiveFileController.updateResponsiveFile(id, {
          ...data,
          file_route: path.join(filePath, uniqueName),
          user_id_fk: 1,
        });

      // Delete the old file
      console.log("Borrado archivo anterior");
      try {
        fs.unlinkSync(oldPdfRoute);
      } catch (error) {
        console.log("Old file wasn't deleted or found");
      }
      console.log("Envío de datos");
      return res.status(200).json({
        message: `Responsive File updated successfully with ID: ${responsiveFileStored.resp_id}`,
      });
    } else {
      const servers = await serverController.getServersByRespIDFK(
        responsiveFile.resp_id
      );
      //Delete servers
      if (servers)
        servers.forEach((server) => {
          serverController.deleteServer(server.server_id);
        });
      //Create new servers
      if (data.servers){
        console.log("Insertar servidores: ", data.servers )
        data.servers.forEach((server) => {
          serverController.insertServer({
            server_name: server.windows_server,
            account: server.account,
            domain: server.domain,
            responsive_file_id_fk: data.resp_id,
          });
        });
      }
      const responsiveFileStored =
        await responsiveFileController.updateResponsiveFile(id, {
          ...data,
          user_id_fk: 1,
        });
      return res.status(200).json({
        message: `Responsive File updated successfully with ID: ${responsiveFileStored.resp_id}`,
      });
    }
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
    const servers = await serverController.getServersByRespIDFK(
      responsiveFile.resp_id
    );
    const serversArray = servers.map((server) => server.dataValues);
    if (responsiveFile) {
      return res.json({
        ...responsiveFile.dataValues,
        servers: serversArray || [],
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
      user_id_fk: 1, //modify_user_id
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
 * Email Notify
 */

router.post("/email-notify", async (req, res) => {
  try {
    const data = req.body.data;
    const emailNotify = await emailNotifyController.insertEmailNotify(data);
    return res.status(200).json({
      message: `Email Notify successfully inserted with ID: ${emailNotify.email_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest" });
  }
});

router.get("/email-notify", async (req, res) => {
  try {
    const results = await emailNotifyController.getAllEmailsNotify();
    return res.json(results);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest" });
  }
});

router.delete("/email-notify/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const emailNotify = await emailNotifyController.deleteEmailNotify(id);
    return res.status(200).json({
      message: `File deleted successfully with ID: ${emailNotify.email_id}`,
    });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with email-notify" });
  }
});

/**
 * PDF Store
 */

router.get("/responsive-file/pdf/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("El ID es:", id);
    const responsiveFile = await responsiveFileController.getResponsiveFile(id);
    if (responsiveFile) {
      const fileRoute = responsiveFile.file_route;
      console.log("File route: ", fileRoute);
      const file = fs.readFileSync(fileRoute);
      res.setHeader("Content-Type", "application/pdf");
      res.send(file);
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
    return res.status(200).json({
      api: process.env.TELEGRAM_BOT_TOKEN,
      group: process.env.TELEGRAM_CHAT_GROUP_ID,
      time: process.env.NOTIFICATION_TIME,
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
    if (data.api) {
      updateTelegramBotToken(data.api);
      startBot();
    }
    if (data.group) {
      sendNotification("Mensaje de Prueba. Tu grupo fue registrado", data.group)
        .then(() => {
          updateTelegramChatId(data.group);
          res
            .status(200)
            .json({ message: `Variable ${data} actualizado con éxito` });
        })
        .catch((error) => {
          console.log("Error sending message to Notification Bot:", error);
          res.status(500).json({
            message: "Internal error while sending message to Notification Bot",
          });
        });
    } else {
      if (data.time) {
        updateNotificationTime(data.time);
        initializeScheduler();
      }
      res
        .status(200)
        .json({ message: `Variable ${data} actualizado con éxito` });
    }
  } catch (error) {
    console.log("Error", error);
    res
      .status(500)
      .json({ message: "Internal server error with Notification Bot" });
  }
});

router.use(
  "/files",
  express.static(path.join(__dirname, "../uploads/responsive"))
);

module.exports = router;
