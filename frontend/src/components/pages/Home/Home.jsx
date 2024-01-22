import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { TableContainer } from "../../common/Tables/Table/TableContainer";
import { CardsHomeContainer } from "./CardsHome/CardsHomeContainer";
import { DisplayTableHomeContainer } from "./DisplayTableHome/DisplayTableHomeContainer";
import { DisplayTableLogContainer } from "./DisplayTableLog/DisplayTableLogContainer";
import { deleteResponsive, getAllResponsive } from "../../../services/api";
import { DeleteModalContainer } from "../../common/Modals/DeleteModal/DeleteModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";

export function Home() {
  const [responsiveData, setResponsiveData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeIDRegister, setActiveIDRegister] = useState(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [update, setUpdate] = useState();
  useEffect(() => {
    const fetchResponsiveData = async () => {
      const result = await getAllResponsive();
      setResponsiveData(result);
    };

    fetchResponsiveData();
  }, [update]);

  const handleDelete = async () => {
    if (activeIDRegister) {
      const result = await deleteResponsive(activeIDRegister);
      if (!result.error) {
        setUpdate(!update);
        
      } else {
        console.log("Error, envio falso");
        setShowFailModal(true);
      }
    }
    setShowDeleteModal(false);
  };

  const handleShowDeleteModal = (id) => {
    setActiveIDRegister(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setActiveIDRegister(null);
    setShowDeleteModal(false);
  };

  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  const tableData = [
    { id: 1, name: "Item 1", price: 10 },
    { id: 2, name: "Item 2", price: 20 },
    { id: 3, name: "Item 3", price: 30 },
  ];

  return (
    <Container>
      <Row>
        <Col>
          {responsiveData && (
            <CardsHomeContainer responsiveData={responsiveData} />
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <h4>Responsivas por Notificar</h4>
        <Col>
          {responsiveData && (
            <DisplayTableHomeContainer data={responsiveData} handleShowDeleteModal={handleShowDeleteModal}/>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <DisplayTableLogContainer />
        </Col>
      </Row>
      <DeleteModalContainer
        showModal={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleProcessing={handleDelete}
      />
      <FailModalContainer
        handleClose={handleCloseFailModal}
        showModal={showFailModal}
      />
    </Container>
  );
}
