const responsiveFileController = require("../controller/responsiveFileController");

async function checkIfThereIsBeforeRespID(respID) {
    const responsiveFile = await responsiveFileController.getResponsiveFile(respID);
    return !!responsiveFile && !!responsiveFile.before_resp_id_fk;
  }
  

async function checkIfThereIsAfterRespID(respID) {
    const responsiveFile = await responsiveFileController.getResponsiveFile(respID);
    return !!responsiveFile && !!responsiveFile.after_resp_id_fk;
}

module.exports ={
    checkIfThereIsAfterRespID,
    checkIfThereIsBeforeRespID
}