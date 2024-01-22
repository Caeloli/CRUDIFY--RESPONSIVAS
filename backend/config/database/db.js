const { Pool } = require("pg");

const dbConfigData = {
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "pmrresp",
  port: "5432",
};
const pool = new Pool(dbConfigData);
module.exports = {
  //query: (query, values, fun) => pool.query(query, values, fun),
  //connection: () => pool.connect(),
  //disconnect: () => pool.end(),
  dbConfigData
};
