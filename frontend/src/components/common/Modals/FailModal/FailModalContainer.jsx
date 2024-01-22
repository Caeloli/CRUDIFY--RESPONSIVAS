import React, { useEffect, useState } from "react";
import { FailModalView } from "./FailModalView";

export function FailModalContainer({ showModal, handleClose, }) {

  return (
    <FailModalView
      handleClose={handleClose}
      showModal={showModal}
    ></FailModalView>
  );
}
