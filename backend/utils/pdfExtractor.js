const fs = require("fs");
const PDFParser = require("pdf-parse");
const moment = require("moment");

// Class to extract and search text within a PDF
class PDFTableExtractor {
  constructor(fileBuffer) {
    this.fileBuffer = fileBuffer;
  }

  // Method to generate text data from the PDF file
  async generateFile() {
    const data = await PDFParser(this.fileBuffer);
    this.text = data.text;
  }

  // Method to search for specific words within the PDF text
  async searchWords(lookWord) {
    if (!this.text) {  
      await this.generateFile();
    }
    const lines = this.text.split("\n");  // Split text into lines
    for (const [index, line] of lines.entries()) {  
      const parts = line.split(": ");
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        return lines[index + 1].trim();  // Return the next line if word is found
      }
    }
    return null;  // Return null if word is not found
  }
}

// Subclass for extracting specific format (format 004)
class PDFTableExtractor004 extends PDFTableExtractor {
  constructor(fileBuffer) {
    super(fileBuffer);
  }

  // Method to search for horizontal table data within the PDF text
  async searchHorizontalTable(lookWord) {
    if (!this.text) { 
      await this.generateFile();
    }
    const lines = this.text.split("\n");
    let responsiveData = [];
    let endIndex = null;
    console.log("Lines are: ", lines);
    for (const [index, line] of lines.entries()) {
      const parts = line.split(": ");
      if (endIndex && index <= endIndex) {
        responsiveData.push(parts);  // Collect data until endIndex
      }
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        endIndex = index + 6;  // Set endIndex to 6 lines after the found word
      }
    }
    return responsiveData;
  }
}

// Subclass for extracting specific format (format 003)
class PDFTableExtractor003 extends PDFTableExtractor {
  constructor(fileBuffer) {
    super(fileBuffer);
  }

  // Method to search for horizontal table data within the PDF text
  async searchHorizontalTable(lookWord) {
    if (!this.text) {  
      await this.generateFile();
    }
    const lines = this.text.split("\n");
    let responsiveData = [];
    let endIndex = null;
    for (const [index, line] of lines.entries()) {
      const parts = line.split(": ");
      if (endIndex && index <= endIndex) {
        responsiveData.push(parts);  // Collect data until endIndex
      }
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        endIndex = index + 6;  // Set endIndex to 6 lines after the found word
      }
    }
    return responsiveData;
  }
}

//REMEDY, FICHA, USUARIO, JEFE INMEDIATO, ALTA CUENTA, VENCIMIENTO DE LA CUENTA, ESTADO, RENOVAR, RUTA FORMATO.
// SERVIDOR WINDOWS, DOMINIO, CUENTA
// Function to extract data from a PDF based on format and file provided
const getDataFromPDF = async (format, file) => {
  let pdfTableExtractor = undefined;
  try {
    // Instantiate appropriate extractor based on format
    if (format == 4) {
      pdfTableExtractor = new PDFTableExtractor004(file.buffer);
    } else if (format == 3) {
      pdfTableExtractor = new PDFTableExtractor003(file.buffer);
    } else {
      throw new Error("Invalid format");
    }
  } catch (error) {
    return error;
  }

  // List of words to be searched within the PDF
  const wordsToBeSearched = [
    "REQ Remedy",
    "Ficha o número de ID",
    "Nombre(s)",
    "Apellidos",
    "Nombre jefe Inmediato",
    "Fecha de solicitud",
    "E-mail de Contacto",
  ];

  // Search for each word and collect the results
  let resultsSearch = await Promise.all(
    wordsToBeSearched.map(async (word) => {
      return await pdfTableExtractor.searchWords(word);
    })
  );

  // Search for horizontal table data with the word "Cuenta" for it to stop the trimming
  const resultHorizontalSearch = (
    await pdfTableExtractor.searchHorizontalTable("Cuenta")
  ).map((innerArray) => innerArray.join("").trim());

  let result = null;

  // Function to parse dates
  const parseDates = (dateString) => {
    let startDate = moment().toISOString().slice(0, 10);
    let endDate = moment().add(1, "year").toISOString().slice(0, 10);

    if (dateString) {
      const parsedDate = moment(dateString, "DD/MM/YYYY", true);
      if (parsedDate.isValid()) {
        startDate = parsedDate.toISOString().slice(0, 10);
        endDate = parsedDate.add(1, "year").toISOString().slice(0, 10);
      }
    }

    return { startDate, endDate };
  };

  // Format the extracted data based on the format type
  if (format == 4) {
    const { startDate, endDate } = parseDates(resultsSearch[5]);
    result = {
      remedy: resultsSearch[0],
      token: resultsSearch[1],
      user_name: `${resultsSearch[2]} ${resultsSearch[3]}`.toUpperCase(),
      immediately_chief: resultsSearch[4],
      start_date: startDate,
      end_date: endDate,
      email: resultsSearch[6].toUpperCase(),
      // account: resultHorizontalSearch[0].split(" ")[0],
      // server: resultHorizontalSearch[1] + resultHorizontalSearch[2],
      // domain: resultHorizontalSearch[5],
    };
  }

  if (format == 3) {
    const { startDate, endDate } = parseDates(resultsSearch[5]);
    result = {
      remedy: resultsSearch[0],
      token: resultsSearch[1],
      user_name: `${resultsSearch[2]} ${resultsSearch[3]}`.toUpperCase(),
      immediately_chief: resultsSearch[4],
      start_date: startDate,
      end_date: endDate,
      email: resultsSearch[6].toUpperCase(),
      account: resultHorizontalSearch[0].split(" ")[0],
      windows_server: resultHorizontalSearch[1] + resultHorizontalSearch[2],
      domain: resultHorizontalSearch[5],
    };
  }

  return result;
};

module.exports = {
  getDataFromPDF,
};
