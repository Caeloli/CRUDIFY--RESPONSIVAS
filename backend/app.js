const express = require("express");
const cors = require("cors");
const path = require("path");
const generatePassword = require("generate-password");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const logger = require("morgan");
const config = require("./config/index").configPort();
process.env.PORT = config.port;
const routes = require("./routes/routes");
const app = express();
const bcrypt = require("bcrypt");
const userController = require("./controller/usersController");
const resetTokenController = require("./controller/resetTokenController");
const { verifyToken } = require("./utils/verifyJWTToken");
const notificationServices = require("./services/axiosServices/notificationServices");
const authReqController = require("./controller/authorizationRequestController");
const globals = require("./config/globalVariables");
const router = require("./routes/routes");
const crypto = require("crypto");

const salt = process.env.SALT;
const sk = process.env.SK;
const notifAddress = process.env.NOTIFICATIONS_ADDRESS;

(async () => {
  try {
    const db = await require("./config/database/sequelize");
    while (!db || !db.resetToken) {
      console.log("Waiting for sequelize database connection...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before trying again
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
    let allowedOrigins = ["http://localhost:3000"]; // Origen predeterminado

    // Agrega la dirección IP del servicio de Kubernetes a la lista blanca de allowedOrigins
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

    app.post("/login", async (req, res) => {
      const { user, password } = req.body;

      try {
        //const hashedPassword = await bcrypt.hash(password, salt);
        const userStored = await userController.getUserByEmail(user);

        if (!userStored) {
          return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, userStored.pswrd);
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
      } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });


    app.post("/register", async (req, res) => {
      try {
        const email = req.body.email;
        const userType = parseInt(req.body.userType);
        if (userType !== 1 && userType !== 2) {
          throw new Error("UserType is not defined");
        }

        const authRequest = await authReqController.insertAuthRequest({
          user_id_fk: globals.adminUser.user_id,
          action_id_fk: 1,
          request_date: new Date().getTime(),
          affected_email: email,
          affected_type: userType,
        });

        const users = await userController.getAllUsers();
        const adminUsers = users.filter((user) => user.user_type_id_fk == 2);
        adminUsers.map((adminUser) => {
          notificationServices.sendNotificationEmail(
            adminUser.email,
            `Solicitud de inscripción de usuario: ${email}`,
            `Se solicita a un administrador confirmar o denegar el permiso de inscripción para el usuario con el correo electrónico ${email} con permisos de ${
              userType == 1
                ? "Operador"
                : userType == 2
                ? "Administrador"
                : "Desconocido"
            }. Por favor, tome las medidas necesarias para procesar esta solicitud.`
          );
        });

        console.log("Registro exitoso", email, userType);
        return res.status(200).json({
          message: `Post authRequest successfully with ID: ${authRequest?.request_id}`,
        });
      } catch (error) {
        console.error("Error during registering: ", error);
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

    /**
     * Verifica correo electrónico
     * Verifica si correo no tiene enlace activo,
     * Si expiración aún no pasa de 1 día, indicar al usuario que tiene un token activo.
     * Si no => Envío de enlace del frontend con enlace en su url
     */

    /**
     * ResetTokens
     * resetToken_Id
     * user_id_fk
     * reset_token
     * reset_token_date
     * reset_token_is_active
     */

    app.get("/active", async (req, res) => {
      try {
        return res
          .status(200)
          .json({ message: `Active ${process.env.PMXRESP_NOTIFICATIONS_SERVICE_SERVICE_HOST} ${process.env.PMXRESP_SCHEDULER_SERVICE_SERVICE_HOST} `});
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    });


    app.get("/message", async(req, res) => {
      try{
        notificationServices.sendNotificationTelegram("-1001612435955", "Prueba de Pods")
      } catch(error){
        return res.status(500).json({ message: "Internal server error" });
      }
    })

    app.post("/forgot-password", async (req, res) => {
      try {
        const { email } = req.body;
        const user = await userController.getUserByEmail(email);
        if (!user) {
          return res
            .status(404)
            .json({ message: "Su usuario no fue encontrado." });
        }
        //Verify is mail doesn't have an active link

        const resetTokens = await resetTokenController.getAllResetTokenByUserId(
          user.user_id
        );

        if (resetTokens.length !== 0) {
          const activeToken = resetTokens.find(
            (token) => token.reset_token_status === true
          );

          if (activeToken) {
            const oneDay = 24 * 60 * 60 * 1000;
            const currentTime = new Date().getTime();
            const tokenTime = new Date(activeToken.reset_token_date).getTime();
            if (currentTime - tokenTime < oneDay) {
              return res.status(200).json({
                message:
                  "Ya existe un enlace activo asociado a su perfil. Favor de checar su correo electrónico.",
              });
            } else {
              // Expire the existing token
              await updateResetToken(activeToken.reset_token_id, {
                reset_token_status: false,
              });
            }
          }
        }
        const resetToken = crypto.randomBytes(10).toString("hex");
        await resetTokenController.insertResetToken({
          user_id_fk: user.user_id,
          reset_token: resetToken,
          reset_token_date: new Date().getTime(),
          reset_token_status: true,
        });

        const resetLink = `http://localhost:3000/ResetPassword/${resetToken}`;
        await notificationServices.sendNotificationEmail(
          user.email,
          "Notificación de Restablecimiento de Contraseña",
          `Se ha solicitado restablecer su contraseña. Por favor, haga clic en el enlace a continuación para restablecer su contraseña: \n${resetLink}\n Si no fue usted quien solicitó este cambio, por favor póngase en contacto con soporte.`
        );
        return res.status(200).json({
          message:
            "Correo electrónico enviado satisfactoriamente. Favor de checar su correo electrónico.",
        });
      } catch (error) {
        console.error("Error restoring user:", error);
        res
          .status(500)
          .json({ message: "Internal server error with restoring user" });
      }
    });

    /**
     * Reset Password
     * Recuperación de enlace de URL del front
     * Búsqueda en la base de datos
     * Verificación si token está activo, en fecha y su verificación.
     * Si lo está, indicar en la página su nueva contraseña
     * Si no lo está, indica en la página que hubo un error y no se logró comprobar el enlace.
     */

    app.post("/reset-password", async (req, res) => {
      try {
        const { token } = req.body;
        const resetTokens =
          await resetTokenController.getAllResetTokenByResetToken(token);

        if (resetTokens.length !== 0) {
          const activeToken = resetTokens.find(
            (token) => token.reset_token_status === true
          );

          if (activeToken) {
            const oneDay = 24 * 60 * 60 * 1000;
            const currentTime = new Date().getTime();
            const tokenTime = new Date(activeToken.reset_token_date).getTime();

            if (currentTime - tokenTime < oneDay) {
              console.log("Updating password", activeToken);
              const user = await userController.getUser(activeToken.user_id_fk);

              if (user) {
                const symbols = "@$!%+*?&";

                const newPassword = generatePassword.generate({
                  length: Math.floor(Math.random() * 11) + 9,
                  numbers: true,
                  symbols: true,
                  uppercase: true,
                  lowercase: true,
                  strict: true, // Only include specified symbols
                  excludeSimilarCharacters: true, // Exclude similar characters like 'l' and '1'
                  symbols: symbols,
                });

                const hashedPassword = await bcrypt.hash(newPassword, salt);
                const passwordMatch = await bcrypt.compare(newPassword, hashedPassword);
                console.log("PM", passwordMatch);
                const updatedUser = await userController.updateUser(
                  user.user_id,
                  {
                    pswrd: hashedPassword,
                  }
                );
                const updatedResetToken =
                  await resetTokenController.updateResetToken(
                    activeToken.reset_token_id,
                    {
                      reset_token_status: false,
                    }
                  );
                if (updatedUser && updatedResetToken) {
                  return res.status(200).json({
                    message: `Contraseña actualizada correctamente. Su nueva clave de acceso es: ${newPassword}`,
                  });
                } else {
                  return res
                    .status(500)
                    .json({ message: "Error updating user" });
                }
              } else {
                return res
                  .status(404)
                  .json({ message: "Usuario no encontrado" });
              }
            } else {
              // Expire the existing token
              await updateResetToken(activeToken.reset_token_id, {
                reset_token_status: false,
              });
              console.log("Token inactivo encontrado");
              return res
                .status(500)
                .json({ message: "Token inactivo encontrado" });
            }
          } else {
            console.log("No se encontró un token activo");
            return res
              .status(500)
              .json({ message: "No se encontró un token activo" });
          }
        } else {
          console.log("Token no encontrado");
          return res.status(404).json({ message: "Token no encontrado" });
        }
      } catch (error) {
        console.error("Error restaurando usuario:", error);
        return res.status(500).json({
          message: "Error interno del servidor al restaurar el usuario",
        });
      }
    });

    app.use("/pmx-resp", verifyToken, routes);
  } catch (error) {}
})();

/*const { email } = req.body;
        const user = await userController.getUserByEmail(email);
        if (user) {
          const symbols = "@$!%+*?&";
          const newPassword = generatePassword.generate({
            length: Math.floor(Math.random() * 11) + 9,
            numbers: true,
            symbols: true,
            uppercase: true,
            lowercase: true,
            strict: true,
            excludeSimilarCharacters: true,
            symbols: symbols,
          });
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          const updatedUser = await userController.updateUser(user.user_id, {
            pswrd: hashedPassword,
          });
          if (updatedUser) {
            const backendNotification = "http://localhost:10333";
            axios
              .post(`${backendNotification}/send-email`, {
                to: updatedUser.email,
                subject: "Recuperación y Actualización de Contraseña",
                text: `Su contraseña para el correo electrónico ${updatedUser.email} ha sido actualizada a ${newPassword} Por favor, verifique sus credenciales.`,
              })
              .then(() => {
                res
                  .status(200)
                  .json({ message: "Password updated successfully" });
              })
              .catch(async (error) => {
                await userController.updateUser(user.user_id, {
                  pswrd: user.pswrd,
                });
                console.error("Error sending email: ", error);
                res
                  .status(500)
                  .json({ message: "Failed to send email notification" });
              });
          }
        } else {
          res.status(404).json({ message: "User not found" });
        }
        */

module.exports = app;
