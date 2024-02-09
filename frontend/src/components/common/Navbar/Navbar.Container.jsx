import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { NavbarView } from "./Navbar.View";

export function NavbarContainer() {
  const handleLogOut = () => {
    localStorage.removeItem("jwt");
  };

  return <NavbarView handleLogOut={handleLogOut} />;
}
