/*
import {}
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function extractPdfText(pdfFile) {
  console.log("Se carga pdfFile en extractor");
  return new Promise(async (resolve, reject) => {
    try {
      const data = await getDataUrl(pdfFile); // Convert file to data URL

      const pdfURL = URL.createObjectURL(pdfFile);

      console.log("Convertir PDF a URL: ", pdfURL);
      const pdf = await PDFDocument.load(pdfFile);
      console.log("PDF: ", pdf);
      /*
      const textPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        console.log("Page: ", page);
        const textContent = await page.getTextContent();
        console.log("TextContent: ", textContent);
        const pageText = textContent.items.map((item) => item.str).join(" ");
        textPromises.push(pageText);
      }
      const pageTexts = await Promise.all(textPromises);
      const extractedText = pageTexts.join(" ");
      resolve(extractedText);
      
    } catch (error) {
      reject(error);
    }
  });
}

function getDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

*/