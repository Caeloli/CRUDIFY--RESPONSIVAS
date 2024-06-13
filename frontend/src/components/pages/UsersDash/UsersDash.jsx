import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./UsersDash.scss";

export function UsersDash() {
  const location = useLocation();

  return (
    <Container>
      <h2>Usuarios</h2>
      <Row className="pb-3">
        <Col className={`userdash-nav-tab ${location.pathname === "/Users" && "border-bottom border-5"}`} md={2}>
          <Link to={"/Users"} className="link-danger">
            <h5 className="text-center">Usuarios</h5>
          </Link>
        </Col>
        <Col className={`userdash-nav-tab ${location.pathname === "/Users/Authorization" && "border-bottom border-5"}`} md={2}>
          <Link  to={"/Users/Authorization"} className="link-danger">
            <h5 className="text-center">Autorizaciones</h5>
          </Link>
        </Col>
      </Row>
      <Row>
        <Outlet />
      </Row>
    </Container>
  );
}