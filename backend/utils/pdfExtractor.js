const fs = require("fs");
const PDFParser = require("pdf-parse");
const moment = require("moment");
//FO-GSD-SPW-003
class PDFTableExtractor {
  constructor(fileBuffer) {
    this.fileBuffer = fileBuffer;
  }

  async generateFile() {
    const data = await PDFParser(this.fileBuffer);
    this.text = data.text;
  }

  async searchWords(lookWord) {
    if (!this.text) {
      await this.generateFile();
    }
    const lines = this.text.split("\n");
    for (const [index, line] of lines.entries()) {
      const parts = line.split(": ");
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        return lines[index + 1].trim();
      }
    }
    return null;
  }
}

class PDFTableExtractor004 extends PDFTableExtractor {
  constructor(fileBuffer) {
    super(fileBuffer);
  }

  async searchHorizontalTable(lookWord) {
    if (!this.text) {
      await this.generateFile();
    }
    const lines = this.text.split("\n");
    let responsiveData = [];
    let endIndex = null;
    console.log("Lines son: ", lines);
    for (const [index, line] of lines.entries()) {
      const parts = line.split(": ");
      if (endIndex && index <= endIndex) {
        responsiveData.push(parts);
      }
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        endIndex = index + 6;
      }
    }
    return responsiveData;
  }
}

class PDFTableExtractor003 extends PDFTableExtractor {
  constructor(fileBuffer) {
    super(fileBuffer);
  }

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
        responsiveData.push(parts);
      }
      if (parts[0].trim().toLowerCase() === lookWord.toLowerCase()) {
        endIndex = index + 6;
      }
    }
    return responsiveData;
  }
}

//REMEDY, FICHA, USUARIO, JEFE INMEDIATO, ALTA CUENTA, VENCIMIENTO DE LA CUENTA, ESTADO, RENOVAR, RUTA FORMATO.

// SERVIDOR WINDOWS, DOMINIO, CUENTA
const getDataFromPDF = async (format, file) => {
  console.log(
    "Entra en getDataFromPDF con format: ",
    format,
    " y file: ",
    file
  );

  let pdfTableExtractor = undefined;
  try {
    if (format == 4) {
      pdfTableExtractor = new PDFTableExtractor004(file.buffer);
    } else if (format == 3) {
      console.log("Entra en formato 3");
      pdfTableExtractor = new PDFTableExtractor003(file.buffer);
    } else {
      throw new Error("Formato no valido");
    }
  } catch (error) {
    return error;
  }
  const wordsToBeSearched = [
    "REQ Remedy",
    "Ficha o número de ID",
    "Nombre(s)",
    "Apellidos",
    "Nombre jefe Inmediato",
    "Fecha de solicitud",
    "E-mail de Contacto",
  ];

  let resultsSearch = await Promise.all(
    wordsToBeSearched.map(async (word) => {
      return await pdfTableExtractor.searchWords(word);
    })
  );
  const resultHorizontalSearch = (
    await pdfTableExtractor.searchHorizontalTable("Cuenta")
  ).map((innerArray) => innerArray.join("").trim());

  let result = null;
  if(format == 4){
    //console.log("rs", resultsSearch);
    //console.log("rsh", resultHorizontalSearch);
    result = {
        remedy: resultsSearch[0],
        token: resultsSearch[1],
        user_name: resultsSearch[2] + " " + resultsSearch[3],
        immediately_chief: resultsSearch[4],
        start_date: resultsSearch[5] ? moment(resultsSearch[5], "DD/MM/YYYY", true)
          .toISOString()
          .slice(0, 10) : moment(),
        end_date: resultsSearch[5] ? moment(resultsSearch[5], "DD/MM/YYYY", true)
          .add(1, "year")
          .toISOString()
          .slice(0, 10) : moment().add(1, "year"),
        email: resultsSearch[6],
        //account: resultHorizontalSearch[0].split(" ")[0],
        //server: resultHorizontalSearch[1] + resultHorizontalSearch[2],
        //domain: resultHorizontalSearch[5],
      };
  }
  if (format == 3) {
    result = {
      remedy: resultsSearch[0],
      token: resultsSearch[1],
      user_name: resultsSearch[2] + " " + resultsSearch[3],
      immediately_chief: resultsSearch[4],
      start_date: moment(resultsSearch[5], "DD/MM/YYYY", true)
        .toISOString()
        .slice(0, 10),
      end_date: moment(resultsSearch[5], "DD/MM/YYYY", true)
        .add(1, "year")
        .toISOString()
        .slice(0, 10),
      email: resultsSearch[6],
      account: resultHorizontalSearch[0].split(" ")[0],
      windows_serverrt: resultHorizontalSearch[1] + resultHorizontalSearch[2],
      domain: resultHorizontalSearch[5],
    };
  }
  return result;
};

module.exports = {
  getDataFromPDF,
};
