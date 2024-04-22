const express = require("express");
const { restartScheduler } = require("./scheduler");
require("./scheduler").initializeScheduler();
require("dotenv").config();
const logger = require("morgan");
const app = express();
const port = 10335;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.json());


app.post("/restart-scheduler", async (req, res) => {
  try{
    restartScheduler();
    res.status(200).send("Scheduler restared");
  } catch(error){
    console.error("Error starting scheduler: ", error);
    res.status(500).send("Failed to start scheduler");
  }
});

app.listen(port, () => {
  console.log(`Express.js sever on exec in http://${process.env.PMXRESP_SCHEDULER_SERVICE_SERVICE_HOST}:${port}`);
});