const {getDataFromPDF} = require("./pdfExtractor")

const generateUniqueFileName = (originalFileName) => {
  return `${Date.now()}_${originalFileName}`;
};

module.exports = {
    generateUniqueFileName,
    getDataFromPDF
}
