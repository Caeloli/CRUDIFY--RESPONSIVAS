import React, { useEffect, useMemo, useState } from "react";
import {
  deleteAuthRequest,
  getAllAuthAllowByUser,
  updateAuthAllow,
} from "../../../../services/api";
import { FSPTableContainer } from "../../../common/Tables/FSPTable/FSPTableContainer";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { Col, Row } from "react-bootstrap";
export function AuthorizationContainer() {
  const [authData, setAuthData] = useState(null);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authAllows = await getAllAuthAllowByUser();
        console.log("Auth allow: ", authAllows);
        setAuthData(authAllows);
      } catch (error) {
        console.error("Error fetch auth data", error);
      }
    };

    fetchData();
  }, [update]);

  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.AuthorizationRequest.request_id,
      id: "request_id",
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
    },
    {
      accessorFn: (row) => row.AuthorizationRequest.action_id_fk,
      id: "action_id_fk",
      cell: (info) =>
        info.getValue() === 1
          ? "Insert"
          : info.getValue() === 2
          ? "Update"
          : info.getValue() === 3
          ? "Delete"
          : "Unknown",
      header: () => <span>Acción</span>,
    },
    {
      accessorFn: (row) => row.AuthorizationRequest.request_date,
      id: "request_date",
      cell: (info) => info.getValue(),
      header: () => <span>Fecha de Solicitud</span>,
    },
    {
      accessorFn: (row) => row.AuthorizationRequest.affected_email,
      id: "affected_email",
      cell: (info) => info.getValue(),
      header: () => <span>Correo por Registrar</span>,
    },
    {
      accessorFn: (row) => row.is_allowed,
      id: "is_allowed",
      cell: (info) =>
        info.getValue() ? "Aceptado\n(esperando confirmación)" : "No aceptado",
      header: () => <span>Avalado</span>,
    },
    {
      accessorFn: (row) => row,
      id: "allow_id",
      cell: (info) => {
        return (
          <Row>
            <Col md={12} className="d-flex justify-content-evenly">
              {info.getValue().is_allowed ? (
                <IoMdClose
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#FB4D83",
                  }}
                  onClick={() => handleDenyRequest(info.getValue().allow_id)}
                />
              ) : (
                <FaCheck
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#1A855E",
                  }}
                  onClick={() => handleAcceptRequest(info.getValue().allow_id)}
                />
              )}

              <IoMdTrash
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#FB4D83",
                }}
                onClick={() =>
                  handleDeleteRequest(
                    info.getValue().AuthorizationRequest.request_id
                  )
                }
              />
            </Col>
          </Row>
        );
      },
      header: () => <span>Acciones</span>,
    },
  ]);

  const handleDeleteRequest = async (id) => {
    console.log("VALOR:", id);
    const result = await deleteAuthRequest(id);
    setUpdate(!update);
  };

  const handleDenyRequest = async (id) => {
    console.log("VALOR:", id);
    const result = await updateAuthAllow(id, { is_allowed: false });
    setUpdate(!update);
  };

  const handleAcceptRequest = async (id) => {
    console.log("VALOR:", id);
    const result = await updateAuthAllow(id, { is_allowed: true });
    setUpdate(!update);
  };

  return (
    authData && (
      <FSPTableContainer data={authData} columns={columns} fixedColumns={[]} tableStyles={{minHeight: "auto"}} />
    )
  );
}
