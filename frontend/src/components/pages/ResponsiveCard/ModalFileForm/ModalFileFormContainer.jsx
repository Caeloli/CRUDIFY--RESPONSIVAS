import React, { useState } from "react";
import { ModalFileFormVisual } from "./ModalFileFormVisual";
import { getFileData } from "../../../../services/api";

export function ModalFileFormContainer({
  showModal,
  handleClose,
  handleAutoResponsive,
}) {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState(null);
  const [errors, setErrors] = useState({});

  const validateFile = () => {
    let errors = {};
    if (!file) errors.file = "No se ha subido ningún archivo";
    if (!format) {
      errors.format = "No se ha indicado el tipo de formato del archvio";
    }
    if (format < 3 || format > 4) {
      errors.formatData = "El formato debe ser 3 o 4.";
    }
    return errors;
  };

  const handleProcessing = async () => {
    const errors = await validateFile();
    if (Object.keys(errors).length !== 0) {
      setErrors(errors);
      return;
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify({ formatData: format }));
      const result = await getFileData(formData);      
      if (result) {
        handleAutoResponsive({ ...result, file: file, file_format: format });
      }
      //const results = await extractPdfText(file);
      //console.log("Desplegando resultados: ", results);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  return (
    <ModalFileFormVisual
      errorsDisplay={errors}
      showModal={showModal}
      handleClose={handleClose}
      handleProcessing={handleProcessing}
      handleFileChange={handleFileChange}
      handleFormatChange={handleFormatChange}
    />
  );
}
