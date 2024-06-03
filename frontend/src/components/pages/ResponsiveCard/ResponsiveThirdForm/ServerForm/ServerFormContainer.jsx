import React from "react";
import { ServerFormView } from "./ServerFormView";
import * as yup from "yup";
export function ServerFormContainer({
  isReadMode,
  isUpdateMode,
  isInsertMode,
  handlePopServer,
}) {
  const ServerSchema = yup.object().shape({
    windows_server: yup
      .string()
      .required("Servidor windows es un campo obligatorio"),
    domain: yup.string().required("Dominio es un campo obligatorio"),
    account: yup.string().required("Cuenta es un campo obligatorio"),
  });

  const initialValues = {
    windows_server: "",
    domain: "",
    account: "",
  };

  const handleServerSubmit = (values) => {
    
  }

  return (
    <ServerFormView
      schema={ServerSchema}
      initialValues={initialValues}
      handlePopServer={handlePopServer}
      handleServerSubmit={handleServerSubmit}
    ></ServerFormView>
  );
}
