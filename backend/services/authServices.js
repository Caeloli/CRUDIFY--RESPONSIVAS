const generatePassword = require("generate-password");
const bcrypt = require("bcrypt");

const authAllowController = require("../controller/authorizationAllowController");
const authReqController = require("../controller/authorizationRequestController");
const userController = require("../controller/usersController");
const { sendNotification } = require("./bot/tbot");
require("dotenv").config();
const salt = process.env.SALT;

const checkAuthRequest = async (requestId) => {
  try {
    console.log("Validating the request");
    const authAllows = await authAllowController.getAllAuthAllowByRequestId(
      requestId
    );
    let isAllowed = true;
    console.log("Looping through the method");
    for (const authAllow of authAllows) {
      if (!authAllow.is_allowed) {
        isAllowed = false;
        break; // No need to continue checking once a non-allowed entry is found
      }
    }
    console.log("Checking isAllowed");
    if (isAllowed) {
      // Update Request obtaining insert, update, or delete
      console.log("Updating status");
      const authRequest = await authReqController.getAuthRequest(requestId);
      const symbols = "@$!%+*?&";

      const pswrd = generatePassword.generate({
        length: Math.floor(Math.random() * 11) + 9,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true, // Only include specified symbols
        excludeSimilarCharacters: true, // Exclude similar characters like 'l' and '1'
        symbols: symbols,
      });
      const hash = await bcrypt.hash(pswrd, salt);
      userController.insertUser({
        email: authRequest.affected_email,
        user_type_id_fk: authRequest.affected_type,
        pswrd: hash,
      });

      const email = authRequest.affected_email;
      const chat_id = authRequest.chat_id;
      const authRequestDeleted = await authReqController.deleteAuthRequest(
        authRequest.request_id
      );
      sendNotification(
        `Su usuario con el correo ${email} fue registrado correctamente. \nSu clave de acceso es: ${pswrd}`,
        chat_id
      );
    } else {
      return;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error accordingly
  }
};

module.exports = {
  checkAuthRequest,
};
