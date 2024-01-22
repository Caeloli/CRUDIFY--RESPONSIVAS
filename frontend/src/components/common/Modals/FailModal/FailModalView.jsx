import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

export function FailModalView({ showModal, handleClose, message }) {
  return (
    <Modal show={showModal} onHide={handleClose} size="md" centered>
      <ModalHeader>
        <ModalTitle>Error</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>
          {message ??
            "Error al procesar los datos. Inténtalo nuevamente más tarde"}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Regresar</Button>
      </ModalFooter>
    </Modal>
  );
}
