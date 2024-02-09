const { getDataFromPDF } = require("./pdfExtractor");
const { verifyToken } = require("./verifyJWTToken");
const generateUniqueFileName = (originalFileName) => {
  return `${Date.now()}_${originalFileName}`;
};

module.exports = {
  generateUniqueFileName,
  getDataFromPDF,
  verifyToken,
};
