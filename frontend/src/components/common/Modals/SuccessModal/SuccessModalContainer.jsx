import React, { useEffect, useState } from "react";
import { SuccessModalView } from "./SucessModalView";

export function SuccessModalContainer({ showModal, handleClose }) {
 
  return (
    <SuccessModalView
      handleClose={handleClose}
      showModal={showModal}
    ></SuccessModalView>
  );
}
