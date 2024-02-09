import React from "react";
import { MenuView } from "../Menu/Menu.View";
import { Container, Row, Col } from "react-bootstrap";
import { NavbarView } from "../Navbar/Navbar.View";
import { Outlet } from "react-router-dom";
import { NavbarContainer } from "../Navbar/Navbar.Container";

export function OutletView() {
  return (
    <div className="d-flex flex-column">
      <NavbarContainer />
      <Outlet />
    </div>
  );
}
