const { Pool } = require("pg");

const dbConfigData = {
  host: "baasu.db.elephantsql.com",
  user: "sekhxmlv",
  password: "kidni1MahHA75YQQWEUuIhP4AkmJ9gGX",
  database: "sekhxmlv",
  port: "5432"
  /*
  host: "localhost",
  user: "pmrresp_super", //
  password: "i7GD1FW0a9YrbmZN", //
  database: "pmrresp",
  port: "5432",
  */
};
const pool = new Pool(dbConfigData);
module.exports = {
  //query: (query, values, fun) => pool.query(query, values, fun),
  //connection: () => pool.connect(),
  //disconnect: () => pool.end(),
  dbConfigData
};
