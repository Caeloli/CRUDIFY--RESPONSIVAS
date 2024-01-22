const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../config/database/sequelize");
const responsiveFileController = require("../controller/responsiveFileController");
const serverController = require("../controller/serversController");
const fileController = require("../controller/fileController");
const userController = require("../controller/usersController");
const utils = require("../utils/functions");

//const responsiveFileModel = require("../model/responsivefile.model")

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

router.get("/users", async (req, res) => {
  try {
    const User = db.user;
    const results = await userController.getAllUsers();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with users" });
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
    const AuditLog = db.auditLog;
    const results = await AuditLog.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with auditlog" });
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
    const data = req.body.data;
    console.log("El id es:", id);
    console.log("El file es:", file);
    console.log("DATA ES: ", data);
    // Get existing responsive file
    const responsiveFile = await responsiveFileController.getResponsiveFile(id);

    // Save the old PDF route for later deletion
    const oldPdfRoute = responsiveFile.file_route;

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
        ...JSON.parse(data),
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
      message: `File uploaded successfully with ID: ${responsiveFileStored.resp_id}`,
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
    const responsiveFile = await responsiveFileController.deleteResponsiveFile(
      id
    );
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

router.get("/authrequest", async (req, res) => {
  try {
    const AuthRequest = db.authorizationRequest;
    const results = await AuthRequest.findAll();
    return res.json(results);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error with authRequest" });
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
module.exports = router;
