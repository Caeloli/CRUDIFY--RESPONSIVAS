const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const logger = require("morgan");
const config = require("./config/index").configPort();
process.env.PORT = config.port;
const indexRouter = require("./routes/index");
const routes = require("./routes/routes");
const app = express();
const bcrypt = require("bcrypt");
const userController = require("./controller/usersController");
const { verifyToken } = require("./utils/verifyJWTToken");
const { startBot } = require("./services/bot/tbot");
const initializeScheduler = require("./services/schedule/scheduler");

const salt = process.env.SALT;
const sk = process.env.SK;

app.use(
  cors({
    origin: [
      "44.226.145.213",
      "54.187.200.255",
      "34.213.214.55",
      "35.164.95.156",
      "44.230.95.183",
      "44.229.200.200",
      "https://pmx-resp.onrender.com",
      "http://localhost:3000",
      "*",
    ],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("build"));

/*
const { Pool } = require('pg');
    const pool = new Pool(dbConfigData);
    await assignSequelize(dbConfigData);
    const sequelize = await getSequelize();
    await pool.connect();
    console.log("Connected to PostgreSQL database");
    await app.use((req, res, next) => {
      console.log("Enter in assignment of request methods");
      if(!pool && !sequelize){
        console.error("Pool nor sequelize are defined");
        return res.status(500).json({message: "Internal Server Error"});
      }
      req.postgresdb = pool;
      req.sequelize = sequelize;
      req.testString = "Estoy harto de estammada";
      next();
    });
*/
/*
(function () {
  const { Pool } = require("pg");
  const { dbConfigData } = require("./config/database/db");
  const pool = new Pool(dbConfigData);
  console.log("Pool integrated");
  pool.connect();
  console.log("Sequelize integrated");
  app.use((req, res, next) => {
    if (!pool) {
      console.error("Pool isn't defined");
      return res.status(500).json({ message: "Internal Server Error" });
    }
    console.log("Enter in assignment of request methods");
    req.postgresdb = pool;

    next();
  });
})();
*/
//app.use("/", indexRouter);
/*app.use("/docker", async (request, result) => {
    try {
      const client = await pool.connect();
      const queryDatabaseCurrent = await client.query('SELECT current_database() as database_name');
        const databaseName = queryDatabaseCurrent.rows[0].database_name;
        client.release(); // Release the client back to the pool immediately
    } catch (error) {
      console.error("Error connecting to the database:", error);
      res.status(500).json({ status: "Database connection error" });
    }
  });
  */
app.post("/login", async (req, res) => {
  const { user, password } = req.body;
  try {
    //const hashedPassword = await bcrypt.hash(password, salt);
    const userStored = await userController.getUserByEmail(user);
    if (!userStored) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, userStored.pswrd);
    if (passwordMatch) {
      const token = jwt.sign(
        { user_id: userStored.user_id, email: userStored.email },
        sk,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json(token);
    } else {
      return res.status(401).json({ message: "Incorrect credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/verify-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, sk);
    return res.status(200).json({ message: "Authorized", user: decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.use("/pmx-resp", routes);
try{
  startBot();
  initializeScheduler();

} catch(error){
  console.log("BOT O SCHEDULER ERROR")
}

module.exports = app;
