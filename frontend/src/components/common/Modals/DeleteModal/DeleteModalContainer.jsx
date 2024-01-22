import React, { useEffect, useState } from "react";

import { FailModalView } from "../FailModal/FailModalView";
import { DeleteModalView } from "./DeleteModalView";

export function DeleteModalContainer({ showModal, handleClose, handleProcessing }) {
  return (
    <DeleteModalView
      handleClose={handleClose}
      showModal={showModal}
      handleProcessing={handleProcessing}
    ></DeleteModalView>
  );
}
