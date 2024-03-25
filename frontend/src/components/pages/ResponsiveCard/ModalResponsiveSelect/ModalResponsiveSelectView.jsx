import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { FSPTableContainer } from "../../../common/Tables/FSPTable/FSPTableContainer";

export function ModalResponsiveSelectView({
  showModal,
  handleClose,
  handleProcessing,
  message,
  columns,
  data,
  filter,
  pRowSelection,
  pSetRowSelection,
  rowSelectionObject,
}) {
  return (
    <Modal show={showModal} onHide={handleClose} size="xl" centered>
      <ModalHeader>
        <ModalTitle>Selección de Responsiva</ModalTitle>
      </ModalHeader>
      <ModalBody 
      
        style={{maxHeight: "90vh", overflow: "scroll"}}
      >
        <FSPTableContainer
          columns={columns}
          data={data}
          filter={filter}
          rowSelectionObject={rowSelectionObject}
          fixedColumns={[]}
          tableStyles={{
            fontSize: "0.8rem",
            minHeight: "50vh"
          }}
          pRowSelection={pRowSelection}
          pSetRowSelection={pSetRowSelection}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => {handleProcessing(); handleClose();}}>Aceptar</Button>
      </ModalFooter>
    </Modal>
  );
}
