import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PdfExtractor({ pdfFile }) {
  return new Promise(async (resolve, reject) => {
    try {
      const pdf = await pdfjs.getDocument(pdfFile);
      const textPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
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
