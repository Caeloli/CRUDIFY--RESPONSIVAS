import React, { useEffect, useState } from "react";
import { ResponsiveThirdFormView } from "./ResponsiveThirdFormView";
import * as yup from "yup";
import {
  getAllUsers,
  getAllUsersServers,
  postResponsive,
  putResponsive,
} from "../../../../services/api";

export function ResponsiveThirdFormContainer({
  setPreviewFile,
  isReadMode,
  isUpdateMode,
  isInsertMode,
  isRenewMode,
  responsiveData,
  isThird,
}) {
  const [file, setFile] = useState(null);
  const [nextResponsive, setNextResponsive] = useState(null);
  const [beforeResponsive, setBeforeResponsive] = useState(null);
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
          servers: isThird
            ? [
                {
                  hostname: "",
                  domain_server: "",
                  ip_address: "",
                },
              ]
            : [
                {
                  brand: "",
                  model: "",
                  serial_number: "",
                  location: "",
                },
              ],

          //windows_server: data.windows_server ?? "",
          //domain: data.domain ?? "",
          //account: data.account ?? "",
          start_date: "",
          end_date: "",
          //file_format: "",
          is_new_user: 0,
          before_responsive_id: null,
          after_responsive_id: null,
          file: null,
        }
  );

  const [startDate, setStartDate] = useState(null);

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
      isThird
        ? yup.object().shape({
            hostname: yup.string().required("Hostanme es un campo obligatorio"),
            domain_server: yup
              .string()
              .required("Dominio es un campo obligatorio")
              .oneOf(["un", "pemex"], "El dominio debe ser 'un' o 'pemex'"),
            ip_address: yup.string().required("IP es un campo obligatorio"),
          })
        : yup.object().shape({
            brand: yup.string().required("Marca es un campo obligatorio"),
            model: yup.string().required("Modelo es un campo obligatorio"),
            serial_number: yup
              .string()
              .required("Número serial es un campo obligatorio"),
            location: yup
              .string()
              .required("Ubicación es un campo obligatorio"),
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
    /*file_format: yup
      .number()
      .required("Formato del archivo es un campo obligatorio")
      .oneOf([3, 4], "El formato del archivo debe ser 3 o 4"),
      */
    // 1: newUser, 2:existentUser
    is_new_user: yup
      .mixed()
      .required("Usuario es Requerido")
      .oneOf([1, 2], "Usuario es Requerido"),
    after_responsive_id: yup.number().notRequired(),
    before_responsive_id: yup.number().notRequired(),
    file: yup
      .mixed().required("Archivo Responsiva es un campo obligatorio")
      
  });

  const handleSubmit = async (values, actions) => {
    values.file_format = isThird ? 3 : 4;

    values.after_responsive_id =
      values.after_responsive_id === "" ? null : values.after_responsive_id;
    values.before_responsive_id =
      values.before_responsive_id === "" ? null : values.before_responsive_id;

    //add file format

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
    if (isInsertMode || isRenewMode) {
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
      setPreviewFile(evt.target.files[0]);
      setFile(evt.target.files[0]);
  };
  
  const handleAutoResponsive = (data) => {
    setInitialValues({
      resp_id: "",
      remedy: data.remedy,
      token: data.token,
      user_name: data.user_server_id ?? data.user_name ?? "",
      email: data.email.toUpperCase(),
      phone: "",
      immediately_chief: data.immediately_chief,
      email_immediately_chief: "",
      servers: isThird
        ? [
            {
              hostname: "",
              domain_server: "",
              ip_address: "",
            },
          ]
        : [
            {
              brand: "",
              model: "",
              serial_number: "",
              location: "",
            },
          ],
      //windows_server: data.windows_server ?? "",
      //domain: data.domain ?? "",
      //account: data.account ?? "",
      start_date: data.start_date,
      end_date: new Date(
        new Date(data.start_date).setFullYear(
          new Date(data.start_date).getFullYear() + 1
        )
      )
        .toISOString()
        .split("T")[0],
      //file_format: data.file_format,
      is_new_user: false,
      after_responsive_id: null,
      before_responsive_id: null,
      file: null,
    });
  };

  const handleNextResponsiveProcess = (idResp) => {
    const id = Object.keys(idResp)[0] ?? null;
    setNextResponsive(id);
  };

  const handleBeforeResponsiveProcess = (idResp) => {
    const id = Object.keys(idResp)[0] ?? null;
    setBeforeResponsive(id);
  };

  return (
    <>
      <ResponsiveThirdFormView
        key={JSON.stringify(initialValues)}
        schema={ResponsiveSchema}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isReadMode={isReadMode}
        isUpdateMode={isUpdateMode}
        isInsertMode={isInsertMode}
        isRenewMode={isRenewMode}
        isThird={isThird}
        handleNextResponsiveProcess={handleNextResponsiveProcess}
        handleBeforeResponsiveProcess={handleBeforeResponsiveProcess}
        //usersServersValues={usersServersDataSelect}
        handleAutoResponsive={handleAutoResponsive}
      />
    </>
  );
}
