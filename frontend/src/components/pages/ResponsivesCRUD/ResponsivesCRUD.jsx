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
import "./ResponsivesCRUD.scss";
import { Link, useNavigate } from "react-router-dom";
import { deleteResponsive, getAllResponsive } from "../../../services/api";
import { DeleteModalContainer } from "../../common/Modals/DeleteModal/DeleteModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";

function ResponsiveTableContainer({
  handleView,
  handleEdit,
  handleDelete,
  responsiveData,
}) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10));

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.resp_id,
        id: "resp_id",
        cell: (info) => info.getValue(),
        header: () => <span>ID</span>,
      },
      {
        accessorFn: (row) => row.token,
        id: "token",
        cell: (info) => info.getValue(),
        header: () => <span>Token</span>,
      },
      {
        header: () => <span>Estado</span>,
        id: "state",
        columns: [
          {
            accessorFn: (row) => row.start_date,
            id: "start_date",
            cell: (info) => info.getValue(),
            header: () => <span>Fecha Inicio</span>,
          },
          {
            accessorFn: (row) => row.end_date,
            id: "end_date",
            cell: (info) => info.getValue(),
            header: () => <span>Fecha Fin</span>,
          },
          {
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
            header: "Estado",
          },
        ],
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
          {
            accessorFn: (row) => row.phone,
            id: "phone",
            cell: (info) => info.getValue(),
            header: () => <span>Teléfono</span>,
          },
          {
            accessorFn: (row) => row.immediately_chief,
            id: "immediately_chief",
            cell: (info) => info.getValue(),
            header: () => <span>Nombre Jefe</span>,
          },
        ],
      },
      {
        header: () => <span>Datos Server</span>,
        id: "server_data",
        columns: [
          {
            accessorFn: (row) => row.remedy,
            id: "remedy",
            cell: (info) => info.getValue(),
            header: () => <span>Remedy</span>,
          },

          /*{
            accessorFn: (row) => row.windows_server,
            id: "windows_server",
            cell: (info) => info.getValue(),
            header: () => <span>Server Windows</span>,
          },
          {
            accessorFn: (row) => row.domain,
            id: "domain",
            cell: (info) => info.getValue(),
            header: () => <span>Dominio</span>,
          },
          {
            accessorFn: (row) => row.account,
            id: "account",
            cell: (info) => info.getValue(),
            header: () => <span>Cuenta</span>,
          },
          */
        ],
      },
      {
        accessorFn: (row) => row.file_format,
        id: "file_format",
        cell: (info) => info.getValue(),
        header: () => <span>Formato</span>,
        footer: (props) => props.column.file_format,
      },
      {
        accessorFn: (row) => row.resp_id,
        header: () => <span>Acciones</span>,
        id: "actions",
        cell: (info) => {
          return (
            <Row>
              <Col md={4}>
                <FaEye
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#006FFF",
                  }}
                  onClick={() => handleView(info.getValue())}
                />
              </Col>
              <Col md={4}>
                <FaEdit
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#EC8850",
                  }}
                  onClick={() => handleEdit(info.getValue())}
                />
              </Col>
              <Col md={4}>
                <FaTrash
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#FB4D83",
                  }}
                  onClick={() => handleDelete(info.getValue())}
                />
              </Col>
            </Row>
          );
        },
      },
    ],
    []
  );

  return responsiveData ? (
    <FSPTableContainer
      data={responsiveData}
      columns={columns}
      fixedColumns={[
        { name: "resp_id", position: "column-fixed-left" },
        { name: "actions", position: "column-fixed-right" },
      ]}
    />
  ) : null;
}

export function ResponsivesCRUD() {
  const [activeIDRegister, setActiveIDRegister] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [responsiveData, setResponsiveData] = useState(null);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsives = await getAllResponsive();
        console.log("RESPONSIVAS: ", responsives);
        const filteredResponsives = responsives.filter(responsive => responsive.state_id_fk !== 5 );
        setResponsiveData(filteredResponsives);
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
        <Row>
          <Col sm={12} md={6}>
            <h3>Tablero Responsivas</h3>
          </Col>
          <Col sm={12} md={6}>
            <Row>
              <Col className="responsive-crud__btn">
                {responsiveData && (
                  <Button onClick={() => exportToExcelResponsivesCrud(responsiveData)}>
                    Generar .xlxs
                  </Button>
                )}
              </Col>
              <Col className="responsive-crud__btn">
                <Link to={"/FilesForm"}>
                  <Button>Añadir</Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <ResponsiveTableContainer
            handleDelete={handleShowDeleteModal}
            handleEdit={handleEdit}
            handleView={handleView}
            responsiveData={responsiveData}
          />
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
