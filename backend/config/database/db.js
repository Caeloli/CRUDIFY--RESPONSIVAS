require("dotenv").config();
const dbConfigData = {
  host: process.env.PMXRESP_DB_HOST ?? "VLVERDBAD010.pemex.pmx.com",
  user: process.env.PMXRESP_DB_USER ?? "pmrresp_super",
  password: process.env.PMXRESP_DB_PASSWORD ?? "i7GD1FW0a9YrbmZN",
  database: process.env.PMXRESP_DB_DATABASE ?? "pmrresp",
  port: process.env.PMXRESP_DB_PORT ?? "5432"
  
  /*
  host: "localhost",
  user: "pmrresp_super", //
  password: "i7GD1FW0a9YrbmZN", //
  database: "pmrresp",
  port: "5432",
  */
};

module.exports = {
  //query: (query, values, fun) => pool.query(query, values, fun),
  //connection: () => pool.connect(),
  //disconnect: () => pool.end(),
  dbConfigData,
};
