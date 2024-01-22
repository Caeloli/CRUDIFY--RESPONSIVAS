import React, { useMemo, useState } from "react";
import { makeData } from "../../../../func/func";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer } from "../../../common/Tables/Table/TableContainer";

export function DisplayTableLogContainer() {
  const [data, setData] = useState(() => makeData(10));
  const refreshData = () => setData(() => makeData(10));
  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.token,
      id: "token",
      cell: (info) => info.getValue(),
      header: () => <span>Acción</span>,
    },
    {
      accessorFn: (row) => row.user_name,
      id: "user_name",
      cell: (info) => info.getValue(),
      header: () => <span>Personal</span>,
    },
    {
      accessorFn: (row) => row.start_date,
      id: "start_date",
      cell: (info) => info.getValue(),
      header: () => <span>Fecha de Operación</span>,
    },
    {
      accessorFn: (row) => row.remedy,
      id: "remedy",
      cell: (info) => info.getValue(),
      header: () => <span>Remedy</span>,
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
          : "Se desconoce";
      },
      header: "Estado",
    },
  ]);

  return <TableContainer data={data} columns={columns} />;
}