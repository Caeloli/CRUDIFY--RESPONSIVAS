import React, { useEffect, useMemo, useState } from "react";
import { makeData } from "../../../../func/func";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer } from "../../../common/Tables/Table/TableContainer";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowRotateRight } from "react-icons/fa6";

export function DisplayTableHomeContainer({ data, handleShowDeleteModal }) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10));
  const [dataNotify, setDataNotify] = useState(null);
  const navigate = useNavigate();

  const handleView = (id, format) => {
    if (format === 3) navigate(`/FilesThirdForm/${id}`);
    else if (format === 4) navigate(`/FilesFourthForm/${id}`);
  };

  const handleEdit = (id, format) => {
    if (format === 3) navigate(`/FilesThirdForm/${id}/update`);
    else if (format === 4) navigate(`/FilesFourthForm/${id}/update`);
  };

  const handleRestore = (id, format) => {
    if (format === 3) navigate(`/FilesThirdForm/${id}/renew`);
    else if (format === 4) navigate(`/FilesFourthForm/${id}/renew`);
  };

  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.resp_id,
      id: "token",
      cell: (info) => info.getValue(),
      header: () => <span>Token</span>,
    },
    {
      accessorFn: (row) => row.remedy,
      id: "user_name",
      cell: (info) => info.getValue(),
      header: () => <span>Nombre</span>,
    },
    {
      accessorFn: (row) => row.start_date,
      id: "start_date",
      cell: (info) => new Date(info.getValue()).toISOString().split("T")[0],
      header: () => <span>Fecha Inicio</span>,
    },
    {
      accessorFn: (row) => row.end_date,
      id: "end_date",
      cell: (info) => new Date(info.getValue()).toISOString().split("T")[0],
      header: () => <span>Fecha Final</span>,
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
    {
      accessorFn: (row) => row,
      header: () => <span>Acciones</span>,
      enableSorting: false,
      id: "actions",
      cell: (info, props) => {
        return (
          <Row className="d-flex justify-content-center">
            <Col md={2}>
              <FaEye
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#006FFF",
                }}
                onClick={() =>
                  handleView(
                    info.getValue().resp_id,
                    info.getValue().file_format
                  )
                }
              />
            </Col>
            {info.getValue().state_id_fk !== 5 && (
              <Col md={2}>
                <FaEdit
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#EC8850",
                  }}
                  onClick={() =>
                    handleEdit(
                      info.getValue().resp_id,
                      info.getValue().file_format
                    )
                  }
                />
              </Col>
            )}

            {info.getValue().state_id_fk !== 5 &&
              info.getValue().state_id_fk !== 6 && (
                <Col md={2}>
                  <MdOutlineCancel
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: "#FB4D83",
                    }}
                    onClick={() => handleCancel(info.getValue().resp_id)}
                  />
                </Col>
              )}

            {info.getValue().state_id_fk !== 6 &&
              info.getValue().state_id_fk !== 5 && (
                <Col md={2}>
                  <FaArrowRotateRight
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: "#11772D",
                    }}
                    onClick={() => {
                      handleRestore(
                        info.getValue().resp_id,
                        info.getValue().file_format
                      );
                    }}
                  />
                </Col>
              )}
          </Row>
        );
      },
    },
  ]);

  return <TableContainer data={data} columns={columns} />;
}
