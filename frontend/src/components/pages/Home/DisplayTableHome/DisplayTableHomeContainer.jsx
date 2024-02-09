import React, { useEffect, useMemo, useState } from "react";
import { makeData } from "../../../../func/func";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer } from "../../../common/Tables/Table/TableContainer";
import { useNavigate } from "react-router-dom";

export function DisplayTableHomeContainer({ data, handleShowDeleteModal }) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10));
  const [dataNotify, setDataNotify] = useState(null);
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/FilesForm/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/FilesForm/${id}/update`);
  };

  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.token,
      id: "token",
      cell: (info) => info.getValue(),
      header: () => <span>Token</span>,
    },
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
      header: () => <span>Correo</span>,
    },
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
      accessorFn: (row) => row.resp_id,
      header: () => <span>Acciones</span>,
      id: "actions",
      cell: (info) => {
        return (
          <>
            <FaEye
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "#006FFF",
              }}
              onClick={() => handleView(info.getValue())}
            />{" "}
            <FaEdit
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "#EC8850",
              }}
              onClick={() => handleEdit(info.getValue())}
            />{" "}
            <FaTrash
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
                color: "#FB4D83",
              }}
              onClick={() => handleShowDeleteModal(info.getValue())}
            />
          </>
        );
      },
    },
  ]);

  return <TableContainer data={data} columns={columns} />;
}
