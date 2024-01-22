import React from "react";
import { MenuView } from "../Menu/Menu.View";
import { Container, Row, Col } from "react-bootstrap";
import { NavbarView } from "../Navbar/Navbar.View";
import { Outlet } from "react-router-dom";

export function OutletView() {
  return (
    <div className="d-flex flex-column">
      <NavbarView />
      <Outlet />
    </div>
  );
}
