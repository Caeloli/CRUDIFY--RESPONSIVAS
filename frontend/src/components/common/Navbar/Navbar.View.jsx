import React from "react";
import { NavItem } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { FaFileAlt, FaMobileAlt, FaUser, FaHome } from "react-icons/fa";
import { IoSettingsSharp, IoExitOutline } from "react-icons/io5";
import "./Navbar.scss";
import { decodeToken } from "../../../func/func";
export function NavbarView({ handleLogOut }) {
  const usr = decodeToken();
  return (
    <>
      <Navbar
        expand={"false"}
        data-bs-theme="dark"
        className="mb-3 position-sticky fixed-top navbar"
      >
        <Container fluid>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
          <Navbar.Brand href="#">
            <div className="navbar-header-logo">
              <img src="./assets/imgs/pmx_white_logo.png" />
            </div>
          </Navbar.Brand>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-false`}
            aria-labelledby={`offcanvasNavbarLabel-expand-false`}
            sm={"w-25"}
            lg={"w-75"}
            className={"w-sm-50 w-lg-25 navbar-menu"}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                <div className="navbar-menu-logo">
                  <img src="./assets/imgs/pmx_white_logo.png" />
                </div>
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="link-light">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavItem>
                  <Link to={"/"} className="d-flex gap-1 align-items-center">
                    <FaHome />
                    <p className="m-0">General</p>
                  </Link>
                </NavItem>
                <NavDropdown
                  title={
                    <>
                      <FaFileAlt /> Responsivas{" "}
                    </>
                  }
                >
                  <NavItem>
                    <Link to={"/Files"}>Tablero</Link>
                  </NavItem>
                  <NavItem>
                    <Link to={"/FilesForm"}>Crear</Link>
                  </NavItem>
                </NavDropdown>
                {usr.user_type === 2 && (
                  <NavItem>
                    <Link
                      to={"/Notifications"}
                      className="d-flex gap-1 align-items-center"
                    >
                      <FaMobileAlt />
                      <p className="m-0">Notificaciones</p>
                    </Link>
                  </NavItem>
                )}
                {usr.user_type === 2 && (
                  <NavItem>
                    <Link
                      to={"/Users"}
                      className="d-flex gap-1 align-items-center"
                    >
                      <FaUser />
                      <p className="m-0">Usuarios</p>
                    </Link>
                  </NavItem>
                )}
                {/*<NavItem>
                  <Link
                    to={"/Settings"}
                    className="d-flex gap-1 align-items-center"
                  >
                    <IoSettingsSharp />

                    <p className="m-0">Configuración</p>
                  </Link>
                </NavItem> */}
              </Nav>
              <Nav>
                <NavItem>
                  <Link
                    className="d-flex gap-1 align-items-center"
                    onClick={handleLogOut}
                    to={"/Login"}
                  >
                    <IoExitOutline />
                    <p className="m-0">Cerrar Sesión</p>
                  </Link>
                </NavItem>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {/*[false, "false", "md", "lg", "false", "xfalse"].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#">Navbar Offcanvas</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-false`}
              aria-labelledby={`offcanvasNavbarLabel-expand-false`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">Link</Nav.Link>
                  <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-false`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))*/}
    </>
  );
}
