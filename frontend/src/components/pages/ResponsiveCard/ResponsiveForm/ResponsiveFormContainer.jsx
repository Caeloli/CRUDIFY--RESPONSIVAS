import React, { useEffect, useState } from "react";
import { ResponsiveFormView } from "./ResponsiveFormView";
import * as yup from "yup";
import { postResponsive, putResponsive } from "../../../../services/api";

export function ResponsiveFormContainer({
  setPreviewFile,
  isReadMode,
  isUpdateMode,
  isInsertMode,
  responsiveData,
}) {
  const [file, setFile] = useState(null);
  const [initialValues, setInitialValues] = useState(
    responsiveData
      ? responsiveData
      : {
          resp_id: "",
          remedy: "",
          token: "",
          user_name: "",
          email: "",
          phone: "",
          immediately_chief: "",
          email_immediately_chief: "",
          servers: [
            {
              windows_server: "",
              domain: "",
              account: "",
            },
          ],
          //windows_server: data.windows_server ?? "",
          //domain: data.domain ?? "",
          //account: data.account ?? "",
          start_date: "",
          end_date: "",
          file_format: "",
          file: null,
        }
  );

  useEffect(() => {
    console.log("Cambio en iV", initialValues);
  }, [initialValues]);

  const ResponsiveSchema = yup.object().shape({
    remedy: yup.string().required("Remedy es un campo obligatorio"),
    token: yup.string().required("Token es un campo obligatorio"),
    user_name: yup
      .string()
      .required("Nombre del usuario es un campo obligatorio"),
    email: yup.string().required("Email es un campo obligatorio"),
    phone: yup.string().notRequired(),
    immediately_chief: yup
      .string()
      .required("Nombre de jefe es un campo obligatorio"),
    email_immediately_chief: yup.string().notRequired(),
    servers: yup.array().of(
      yup.object().shape({
        windows_server: yup.string(),
        domain: yup.string(),
        account: yup.string(),
      })
    ),
    //windows_server: yup
    //  .string()
    //      .required("Servidor windows es un campo obligatorio"),
    //domain: yup.string().required("Dominio es un campo obligatorio"),
    //account: yup.string().required("Cuenta es un campo obligatorio"),
    start_date: yup.date().required("Fecha de inicio es un campo obligatorio"),
    end_date: yup
      .date()
      .required("Fecha final es un campo obligatorio")
      .min(
        yup.ref("start_date"),
        "La fecha final debe ser posterior a la fecha de inicio"
      ),
    file_format: yup
      .number()
      .required("Formato del archivo es un campo obligatorio"),
    file: yup.mixed().required("Archivo es necesario"),
  });

  const handleSubmit = async (values, actions) => {
    console.log("Values", values);
    
    const formData = new FormData();
    const data = Object.keys(values).reduce((acc, key) => {
      if (key !== "file") {
        acc[key] = values[key];
      }
      return acc;
    }, {});
    formData.append("file", file);
    formData.append("data", JSON.stringify(data));
    let result;
    if (isInsertMode) {
      result = await postResponsive(formData);
    } else if (isUpdateMode) {
      result = await putResponsive(initialValues.resp_id, formData);
    }
    if (!result.error) {
      return true; // Success
    } else {
      console.log("Error, envio falso");
      return false; // Error
    }
    
  };

  const handleFileChange = (evt) => {
    console.log("El archivo es: ", evt.target.files[0]);
    setPreviewFile(evt.target.files[0]);
    setFile(evt.target.files[0]);
  };

  const handleAutoResponsive = (data) => {
    console.log("Se llama a gandleAutoResponsive con los datos de", data.file);
    setInitialValues({
      resp_id: "",
      remedy: data.remedy,
      token: data.token,
      user_name: data.user_name,
      email: data.email,
      phone: "",
      immediately_chief: data.immediately_chief,
      email_immediately_chief: "",
      servers: [
        {
          windows_server: "",
          domain: "",
          account: "",
        },
      ],
      //windows_server: data.windows_server ?? "",
      //domain: data.domain ?? "",
      //account: data.account ?? "",
      start_date: data.start_date,
      end_date: data.end_date,
      file_format: data.file_format,
      file: data.file,
    });
  };

  return (
    <ResponsiveFormView
      key={JSON.stringify(initialValues)}
      schema={ResponsiveSchema}
      initialValues={initialValues}
      handleSubmit={handleSubmit}
      handleFileChange={handleFileChange}
      isReadMode={isReadMode}
      isUpdateMode={isUpdateMode}
      isInsertMode={isInsertMode}
      handleAutoResponsive={handleAutoResponsive}
    />
  );
}
