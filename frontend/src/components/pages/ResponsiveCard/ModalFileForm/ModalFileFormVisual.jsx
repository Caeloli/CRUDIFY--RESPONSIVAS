import React from "react";
import {
  Button,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";

export function ModalFileFormVisual({
  errorsDisplay,
  showModal,
  handleClose,
  handleProcessing,
  handleFileChange,
  handleFormatChange,
}) {
  return (
    <Modal show={showModal} onHide={handleClose} size="md" centered>
      <ModalHeader>
        <ModalTitle>Agregar Responsiva</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Container>
          <Row className="mb-3">
            <p>Agrega el archivo que deseas procesar de forma automática</p>
          </Row>
          <Row className="mb-3">
            <Form.Label>Archivo</Form.Label>
            <Form.Control type="file" name="file" onChange={handleFileChange} />
            {errorsDisplay.file && <p>{errorsDisplay.file}</p>}
          </Row>
          <Row className="mb-3">
            <Form.Label>Número de Formato</Form.Label>
            <datalist id="format-list">
              <option value="3"/>
              <option value="4"/>
            </datalist>
            <Form.Control
              type="number"
              name="format"
              list="format-list"
              autoCorrect="off"
              onChange={handleFormatChange}
            />
            {errorsDisplay.format && <p>{errorsDisplay.format}</p>}
            {errorsDisplay.formatData && <p>{errorsDisplay.formatData}</p>}
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => handleProcessing()}>Procesar</Button>
      </ModalFooter>
    </Modal>
  );
}