import React, { useEffect, useState } from "react";
import { verifyToken } from "../../../services/api";
import { Navigate } from "react-router-dom";

export function ProtectedRouteContainer({ child }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const fetchVerifyToken = async () => {
      try {
        const token = localStorage.getItem("jwt");

        if (!token) {
          throw new Error("No token found");
        }

        const result = await verifyToken(token);

        if (!result.error) {
          console.log("Token is valid");
          setIsAuthenticated(true);
        } else {
          console.error("Invalid token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error.message);
        setIsAuthenticated(false);
      }
    };

    fetchVerifyToken();
  }, []);

  if (isAuthenticated === null) {
    // Loading state, you can render a loader here if needed
    return null;
  }

  return isAuthenticated ? child : <Navigate to="/Login" />;
}


