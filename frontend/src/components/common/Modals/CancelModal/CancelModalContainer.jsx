import React, { useEffect, useState } from "react";
import { CancelModalView } from "./CancelModalView";
import * as yup from "yup";
export function CancelModalContainer({
  showModal,
  handleClose,
  handleProcessing,
}) {
  const CommentSchema = yup.object().shape({
    comment: yup.string().required("El comentario es un campo obligatorio"),
  });

  return (
    <CancelModalView
      initialValues={{
        comment: "",
      }}
      schema={CommentSchema}
      handleClose={handleClose}
      showModal={showModal}
      handleProcessing={handleProcessing}
    ></CancelModalView>
  );
}
