import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { getAllUsers, getAllUsersServers, postResponsive, putResponsive } from "../../../../services/api";
import { ResponsiveFourthFormView } from "./ResponsiveFourthFormView";

export function ResponsiveFourthFormContainer({
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
  const [usersServersDataSelect, setUsersServersDataSelect] = useState(null);
  const [usersServerData, setUsersServers] = useState(null);
  useEffect(() => {
    const fetchUsersData = async () => {
      const data = await getAllUsersServers();
      setUsersServers(data);
      const selectDataFormat = data.map((datum) => ({label: datum.user_server_username, value: datum.user_server_id}))
      setUsersServersDataSelect(selectDataFormat);
    }
    if(!isReadMode)
      fetchUsersData();
  }, []);

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
        windows_server: yup.string().required("Server es un campo obligatorio"),
        domain: yup.string().required("Dominio es un campo obligatorio").oneOf(["UN", "PEMEX"], "El dominio debe ser 'UN' o 'PEMEX'"),
        account: yup.string().required("Cuenta es un campo obligatorio"),
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
      .required("Formato del archivo es un campo obligatorio")
      .oneOf([3, 4], "El formato del archivo debe ser 3 o 4"),
    file: yup.mixed().required("Archivo es necesario"),
  });

  const handleSubmit = async (values, actions) => {
    /*
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
    */
  };

  const handleFileChange = (evt) => {
    setPreviewFile(evt.target.files[0]);
    setFile(evt.target.files[0]);
  };

  const handleAutoResponsive = (data) => {
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
    <>
      <ResponsiveFourthFormView
        key={JSON.stringify(initialValues)}
        schema={ResponsiveSchema}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isReadMode={isReadMode}
        isUpdateMode={isUpdateMode}
        isInsertMode={isInsertMode}
        usersServersValues={usersServersDataSelect}
        handleAutoResponsive={handleAutoResponsive}
      />
    </>
  );
}