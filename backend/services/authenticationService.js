const ldap = require("ldapjs");
const fs = require("fs");
const path = require("path");

const ldapConfig = {
  url: `ldap://${process.env.PMXRESP_LDAP_URL}:389`,
  connectTimeout: 10000,
  tlsOptions: {
    ca: [
      fs.readFileSync(path.join(__dirname, "../static/VWTUTDCPP002.cer")),
      fs.readFileSync(path.join(__dirname, "../static/RootPemexPRO.cer")),
      fs.readFileSync(path.join(__dirname, "../static/Pemex-SHA256-PRO.cer")),
    ],
  },
  username: process.env.PMXRESP_LDAP_USERNAME,
  password: process.env.PMXRESP_LDAP_PASSWORD,
  userSearchBase: process.env.PMXRESP_LDAP_DN_SEARCH_BASE,
};

const createClientLDAP = async () => {
  const client = ldap.createClient({
    url: ldapConfig.url,
    timeout: ldapConfig.connectTimeout,
    tlsOptions: ldapConfig.tlsOptions,
    reconnect: {
      initialDelay: 100,
      maxDelay: 5000,
      failAfter: 5,
    },
  });

  client.on("connect", () => {
    console.log("Successful connection with LDAP Server");
  });

  client.on("error", (err) => {
    console.error("LDAP client error:", err);
  });

  return client;
};

//Look for user using mail of the user
const searchUserLDAP = async (identifier) => {
  const client = await createClientLDAP();
  try {
    const opts = {
      filter: `(mail=${identifier})`,
      scope: "sub",
      attributes: ["dn", "sn", "cn", "mail", "employeeID", "displayName"],
    };

    return new Promise((resolve, reject) => {
      //Authenticate system user in order to search into the active directory
      client.bind(ldapConfig.username, ldapConfig.password, (err) => {
        if (err) {
          console.error("Software authentication error");
          return reject(err);
        }

        console.log("Start search for user:", identifier);
        client.search(ldapConfig.userSearchBase, opts, (err, res) => {
          if (err) {
            console.error("User search error:", err.message);
            return reject(err);
          }

          let userInfo = null;

          //Return entry of the user if it is found
          res.on("searchEntry", (entry) => {
            userInfo = {
              objectName: entry.pojo.objectName,
              attributes: entry.attributes.reduce((acc, attribute) => {
                acc[attribute.type] = attribute.values[0];
                return acc;
              }, {}),
            };
          });

          res.on("error", (err) => {
            console.error("User search error:", err.message);
            return reject(err);
          });

          res.on("end", (result) => {
            console.log("status:", result.status);
            resolve(userInfo);
          });
        });
      });
    });
  } finally {
    client.unbind();
  }
};

//Authenticate the user with their credentials
const bindUserLDAP = async (userInfo, password) => {
  const client = await createClientLDAP();
  try {
    return new Promise((resolve, reject) => {
      client.bind(userInfo.objectName, password, (err) => {
        if (err) {
          console.error("Authentication error:", err);
          return reject(err);
        }

        console.log(
          "Successful authentication with user:",
          userInfo.attributes.mail
        );
        resolve();
      });
    });
  } finally {
    client.unbind();
  }
};

const authenticateUserLDAP = async (identifier, password) => {
  try {
    const userInfo = await searchUserLDAP(identifier);
    await bindUserLDAP(userInfo, password);
    return userInfo;
  } catch (err) {
    console.error("Authentication failed:", err);
    return null;
  }
};

module.exports = {
  authenticateUserLDAP,
  searchUserLDAP,
};
