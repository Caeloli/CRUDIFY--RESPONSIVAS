import React, { useEffect, useMemo, useState } from "react";
import {
  acceptAuthRequest,
  deleteAuthRequest,
  getAllAuthRequestData,
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
        const authRequest = await getAllAuthRequestData();
        setAuthData(authRequest);
      } catch (error) {
        console.error("Error fetch auth data", error);
      }
    };

    fetchData();
  }, [update]);

  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.request_id,
      id: "request_id",
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
    },
    {
      accessorFn: (row) => row.action_id_fk,
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
      accessorFn: (row) => row.request_date,
      id: "request_date",
      cell: (info) => info.getValue(),
      header: () => <span>Fecha de Solicitud</span>,
    },
    {
      accessorFn: (row) => row.affected_email,
      id: "affected_email",
      cell: (info) => info.getValue(),
      header: () => <span>Correo por Registrar</span>,
    },
    {
      accessorFn: (row) => row,
      id: "allow_id",
      cell: (info) => {
        return (
          <Row>
            <Col md={12} className="d-flex justify-content-evenly">
            <FaCheck
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#1A855E",
                  }}
                  onClick={() => handleAcceptRequest(info.getValue().request_id)}
                />
            
                <IoMdClose
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#FB4D83",
                  }}
                  onClick={() => handleDenyRequest(info.getValue().request_id)}
                />
            </Col>
          </Row>
        );
      },
      header: () => <span>Acciones</span>,
    },
  ]);

  const handleDenyRequest = async (id) => {
    const result = await deleteAuthRequest(id);
    setUpdate(!update);
  };

  const handleAcceptRequest = async (id) => {
    const result = await acceptAuthRequest(id);
    setUpdate(!update);
  };

  return (
    authData && (
      <FSPTableContainer data={authData} columns={columns} fixedColumns={[]} tableStyles={{minHeight: "auto"}} />
    )
  );
}
