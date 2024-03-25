import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  DropdownButton,
  DropdownItem,
  Row,
} from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { FSPTableContainer } from "../../common/Tables/FSPTable/FSPTableContainer";
import { exportToExcelResponsivesCrud, makeData } from "../../../func/func";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteResponsive,
  getAllResponsive,
  getAllServers,
} from "../../../services/api";
import { DeleteModalContainer } from "../../common/Modals/DeleteModal/DeleteModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";

function ServersF4TableContainer({
  handleView,
  handleEdit,
  handleDelete,
  serverData,
}) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10));

  const columns = useMemo(
    () => [
        {
            accessorFn: (row) => row.model,
            id: "model",
            cell: (info) => info.getValue(),
            header: () => <span>Modelo</span>,
          },
          {
            accessorFn: (row) => row.brand,
            id: "brand",
            cell: (info) => info.getValue(),
            header: () => <span>Marca</span>,
          },
          {
            accessorFn: (row) => row.serial_number,
            id: "serial_number",
            cell: (info) => info.getValue(),
            header: () => <span>Número Serial</span>,
          },
          {
            accessorFn: (row) => row.location,
            id: "location",
            cell: (info) => info.getValue(),
            header: () => <span>Ubicación</span>,
          },
      /*{
        accessorFn: (row) => row.state_id_fk,
        id: "state_id_fk",
        cell: (info) => {
          const state_id = info.getValue();
          return state_id === 1
            ? "Active"
            : state_id === 2
            ? "Notificar"
            : state_id === 3
            ? "Expirado"
            : state_id === 4
            ? "Notificado"
            : "Se desconoce";
        },
        header: () => <span>Estado</span>,
      },
      {
        header: () => <span>Datos Usuario</span>,
        id: "data",
        columns: [
          {
            accessorFn: (row) => row.user_name,
            id: "user_name",
            cell: (info) => info.getValue(),
            header: () => <span>Nombre</span>,
          },
          {
            accessorFn: (row) => row.email,
            id: "email",
            cell: (info) => info.getValue(),
            header: () => <span>Email</span>,
          },
        ],
      },
      */
    ],
    []
  );

  return serverData ? (
    <FSPTableContainer
      data={serverData}
      columns={columns}
      fixedColumns={[
        { name: "resp_id", position: "column-fixed-left" },
        { name: "actions", position: "column-fixed-right" },
      ]}
    />
  ) : null;
}

export function ServersF4() {
  const [activeIDRegister, setActiveIDRegister] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servers = await getAllServers();
        const filteredF4Data = servers.filter((server) => !!server.brand);
        setServerData(filteredF4Data);
      } catch (error) {
        console.error("Error fetching responsives: ", error);
      }
    };

    fetchData();
  }, [update]);

  const handleView = (id) => {
    navigate(`/FilesForm/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/FilesForm/${id}/update`);
  };

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

  const handleShowFailModal = () => {
    setShowFailModal(true);
  };

  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  return (
    <>
      <Container>
        <Row className="mb-3">
          <h3>Tablero Servidores</h3>
          <Row className="mb-5">
            <Row>
              <Col sm={12} md={6}>
                <h4>Tablero Servidores Formato 4</h4>
              </Col>
              <Col sm={12} md={6}>
                <Row>
                  <Col className="d-flex justify-content-end">
                    {serverData && (
                      <Button
                        onClick={() => exportToExcelResponsivesCrud(serverData)}
                      >
                        Generar .xlxs
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <ServersF4TableContainer
                handleDelete={handleShowDeleteModal}
                handleEdit={handleEdit}
                handleView={handleView}
                serverData={serverData}
              />
            </Row>
          </Row>
        </Row>
      </Container>
      <DeleteModalContainer
        showModal={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleProcessing={handleDelete}
      />
      <FailModalContainer
        handleClose={handleCloseFailModal}
        showModal={showFailModal}
      />
    </>
  );
}
