import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { TableContainer } from "../../common/Tables/Table/TableContainer";
import { CardsHomeContainer } from "./CardsHome/CardsHomeContainer";
import { DisplayTableHomeContainer } from "./DisplayTableHome/DisplayTableHomeContainer";
import { DisplayTableLogContainer } from "./DisplayTableLog/DisplayTableLogContainer";
import {
  deleteResponsive,
  getAllAuditLogs,
  getAllResponsive,
  postRestoreFileAuthReq,
} from "../../../services/api";
import { DeleteModalContainer } from "../../common/Modals/DeleteModal/DeleteModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";

export function Home() {
  const [responsiveData, setResponsiveData] = useState(null);
  const [cardResponsiveData, setCardResponsiveData] = useState(null);
  const [auditLogData, setAuditLogData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeIDRegister, setActiveIDRegister] = useState(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [update, setUpdate] = useState();
  useEffect(() => {
    const fetchResponsiveData = async () => {
      const result = await getAllResponsive();
      console.log("RESULT: ", result);
      const filteredCardResult = result.filter(
        (item) => item.state_id_fk != 5
      )
      setCardResponsiveData(filteredCardResult);
      const filteredResponsiveResult = result.filter(
        (item) => item.state_id_fk === 2 || item.state_id_fk === 4
      );
      setResponsiveData(filteredResponsiveResult);
    };

    const fetchAuditLogData = async () => {
      const result = await getAllAuditLogs();
      setAuditLogData(result);
    };
    fetchResponsiveData();
    fetchAuditLogData();
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

  const handleRestoreFile = async (id) => {
    const result = await postRestoreFileAuthReq(id);
    if (!result.error) {
      setUpdate(!update);
    } else {
      console.log("Error, envio falso");
      setShowFailModal(true);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          {cardResponsiveData && (
            <CardsHomeContainer responsiveData={cardResponsiveData} />
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <h4>Responsivas por Notificar</h4>
        <Col>
          {responsiveData && (
            <DisplayTableHomeContainer
              data={responsiveData}
              handleShowDeleteModal={handleShowDeleteModal}
            />
          )}
        </Col>
      </Row>
      <Row>
        <h4>Responsivas Eliminadas</h4>
        <Col>
          <DisplayTableLogContainer
            data={auditLogData}
            handleRestoreFile={handleRestoreFile}
          />
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
