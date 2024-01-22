const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const config = require("./config/index")();
process.env.PORT = config.port;

const indexRouter = require("./routes/index");
const routes = require("./routes/routes");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/pmx-resp", routes);

module.exports = app;
