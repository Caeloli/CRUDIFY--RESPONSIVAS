const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const logger = require("morgan");
const config = require("./config/index").configPort();
process.env.PORT = config.port;
const routes = require("./routes/routes");
const app = express();
const bcrypt = require("bcrypt");
const userController = require("./controller/usersController");
const { verifyToken } = require("./utils/verifyJWTToken");
const notificationServices = require("./services/axiosServices/notificationServices");
const authReqController = require("./controller/authorizationRequestController");
const globals = require("./config/globalVariables");
const { authenticateUserLDAP } = require("./services/authenticationService");

const salt = process.env.PMXRESP_SALT;
const sk = process.env.PMXRESP_SK;


(async () => {
  try {
    //Database connection using sequelize
    const db = await require("./config/database/sequelize");
    //Once sequelize is ready, launch the whole application
    while (!db || !db.resetToken) {
      console.log("Waiting for sequelize database connection...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
    }

    app.use(
      cors(/*{
        origin: function (origin, callback) {
          // Verifica si el origen de la solicitud está permitido
          if (!origin) return callback(null, true);

          // Verifica si el origen está en la lista blanca permitida
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          // Devuelve un error si el origen no está permitido
          return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }*/)
    );

    /* // Lista blanca de orígenes permitidos
    let allowedOrigins = ["http://localhost:3000"]; 

    
    const kubernetesServiceHost = process.env.KUBERNETES_SERVICE_HOST;
    if (kubernetesServiceHost) {
      allowedOrigins.push(`http://${kubernetesServiceHost}`);
    }
    */
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    //app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static("build"));


    /**
     * LOGIN
     * POST: /login: Route for user login
     */
    app.post("/login", async (req, res) => {

      const { user, password } = req.body;
      try {
        console.log("ADMIN USER:", user, globals.adminUser.email, user.trim() !== globals.adminUser.email);
        if (user.trim() !== globals.adminUser.email) {
          //LDAP Authentication for users
          const resultLDAP = await authenticateUserLDAP(user, password);

          if (resultLDAP) {
            //Check if user is in database and is an active user
            const userStored = await userController.getUserByEmail(user);
            if (userStored && userStored.is_active === true) {
              //JWT Token creation
              const token = jwt.sign(
                {
                  user_id: userStored.user_id,
                  email: userStored.email,
                  user_type: userStored.user_type_id_fk,
                },
                sk,
                {
                  expiresIn: "1hr",
                }
              );
              return res.status(200).json(token);
            } else {
              //If not stored or not an active user ->
              //Generate a signupRequest if not already generated
              const signupRequests =
                await authReqController.getAllAuthRequest();
              const signupPetitionFromUser = signupRequests.filter(
                (signup) => signup.affected_email === user
              );

              if (signupPetitionFromUser.length === 0) {
                if (userStored && userStored.is_active === false) {
                  const authRequest = await authReqController.insertAuthRequest(
                    {
                      user_id_fk: globals.adminUser.user_id,
                      action_id_fk: 2,
                      request_date: new Date().getTime(),
                      affected_email: user,
                      affected_name: resultLDAP.attributes.displayName,
                      affected_type: 1,
                    }
                  );
                } else {
                  const authRequest = await authReqController.insertAuthRequest(
                    {
                      user_id_fk: globals.adminUser.user_id,
                      action_id_fk: 1,
                      request_date: new Date().getTime(),
                      affected_email: user,
                      affected_name: resultLDAP.attributes.displayName,
                      affected_type: 1,
                    }
                  );
                }

                //Get mails of admin users and 
                //send a notification to mails of adminUsers 
                //showing that a new user is trying to access the software
                const users = await userController.getAllUsers();
                const adminUsers = users.filter(
                  (user) => user.user_type_id_fk == 2 && user.is_active === true
                );
                adminUsers.map((adminUser) => {
                  notificationServices.sendNotificationEmail(
                    adminUser.email,
                    `Solicitud de inscripción de usuario: ${user}`,
                    `Se solicita a un administrador confirmar o denegar el permiso de inscripción para el usuario con el correo electrónico ${user} con permisos de operador. Por favor, tome las medidas necesarias para procesar esta solicitud.`
                  );
                });

                return res.status(201).json({
                  message: `Post authRequest successfully for ${user}`,
                });
              }
              else {
                return res.status(409).json({ message: "Your petition is already submitted" });    
              }
            }
          } else {
            return res.status(401).json({ message: "Incorrect credentials" });
          }
        } else {
          const hashedPassword = await bcrypt.hash(password, salt);
          const userStored = await userController.getUserByEmail(user);
          if (!userStored) {
            return res.status(404).json({ message: "User not found" });
          }

          const passwordMatch = await bcrypt.compare(
            password,
            userStored.pswrd
          );
          console.log("PM", passwordMatch);
          if (passwordMatch) {
            const token = jwt.sign(
              {
                user_id: userStored.user_id,
                email: userStored.email,
                user_type: userStored.user_type_id_fk,
              },
              sk,
              {
                expiresIn: "1hr",
              }
            );
            return res.status(200).json(token);
          } else {
            return res.status(401).json({ message: "Incorrect credentials" });
          }
        }
        
      } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

   
    /**
     * JWT TOKEN
     * GET: /verify-token: Verify if JWT token is active
     */
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

    /**
     * ACTIVE
     * GET: /active: Check if server is active
     */
    app.get("/active", async (req, res) => {
      try {
        return res.status(200).json({
          message: `Active ${process.env.PMXRESP_NOTIFICATIONS_SERVICE_SERVICE_HOST} ${process.env.PMXRESP_SCHEDULER_SERVICE_SERVICE_HOST} `,
        });
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/message", async (req, res) => {
      try {
        notificationServices.sendNotificationTelegram(
          "-1001612435955",
          "Prueba de Pods"
        );
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    });

   

    app.use("/pmx-resp", verifyToken, routes);
  } catch (error) {}
})();


module.exports = app;
