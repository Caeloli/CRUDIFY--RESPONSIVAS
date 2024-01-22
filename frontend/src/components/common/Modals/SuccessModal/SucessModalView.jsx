import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

export function SuccessModalView({
  showModal,
  handleClose,
  handleProcessing,
  message,
}) {    
  return (
    <Modal show={showModal} onHide={handleClose} size="md" centered>
      <ModalHeader>
        <ModalTitle>Éxito</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>{message ?? "Éxito al procesar los datos."}</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Aceptar</Button>
      </ModalFooter>
    </Modal>
  );
}
