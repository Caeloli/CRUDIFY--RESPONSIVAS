import React, { useEffect, useState } from "react";
import { SuccessModalView } from "./SucessModalView";

export function SuccessModalContainer({ showModal, handleClose, message }) {
 
  return (
    <SuccessModalView
      handleClose={handleClose}
      showModal={showModal}
      message={message}
    ></SuccessModalView>
  );
}
