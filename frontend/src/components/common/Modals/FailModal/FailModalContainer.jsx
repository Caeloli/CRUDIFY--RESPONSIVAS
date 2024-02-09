import React, { useEffect, useState } from "react";
import { FailModalView } from "./FailModalView";

export function FailModalContainer({ showModal, handleClose, message}) {

  return (
    <FailModalView
      handleClose={handleClose}
      showModal={showModal}
      message={message}
    ></FailModalView>
  );
}
