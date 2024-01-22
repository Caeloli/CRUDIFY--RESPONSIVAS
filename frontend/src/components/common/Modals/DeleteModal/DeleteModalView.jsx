import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

export function DeleteModalView({ showModal, handleClose, handleProcessing, message }) {
  return (
    <Modal show={showModal} onHide={handleClose} size="md" centered>
      <ModalHeader>
        <ModalTitle>Eliminar</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>
          {message ??
            "¿Está seguro que desea borrar este registro?"}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleProcessing}>Aceptar</Button>
      </ModalFooter>
    </Modal>
  );
}