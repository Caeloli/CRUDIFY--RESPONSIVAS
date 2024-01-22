import React from "react";
import { Container, Row } from "react-bootstrap";
import { TableContainer } from "../../common/Tables/Table/TableContainer";

export function Notifications() {



  return (
    <Container>
        <h2>Notificaciones</h2>
      <Row>
        <Row>
          <h3>Notificaciones Correo Electrónico</h3>
        </Row>
        <Row>
          <Row>
            <h4>Correos por Notificar</h4>
          </Row>
          <Row>
            <TableContainer />
          </Row>
        </Row>
      </Row>
      <Row>
        <Row>Telegram Bot</Row>
        <Row>API Token</Row>
      </Row>
    </Container>
  );
}
