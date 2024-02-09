import React, { useMemo, useState } from "react";
import { makeData } from "../../../../func/func";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { TableContainer } from "../../../common/Tables/Table/TableContainer";
import { IoIosReturnLeft } from "react-icons/io";

export function DisplayTableLogContainer({ data, handleRestoreFile }) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10))

  

  const columns = useMemo(() => [
    {
      accessorFn: (row) => row.log_id,
      id: "log_id",
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
    },
    {
      accessorFn: (row) => row.user_id_fk,
      id: "user_id_fk",
      cell: (info) => info.getValue(),
      header: () => <span>Usuario</span>,
    },
    {
      accessorFn: (row) => row.action_id_fk,
      id: "action_id_fk",
      cell: (info) => info.getValue(),
      header: () => <span>Acción</span>,
    },
    {
      accessorFn: (row) => row.date,
      id: "date",
      cell: (info) => info.getValue(),
      header: () => <span>Fecha</span>,
    },
    {
      accessorFn: (row) => row.file_id_fk,
      id: "file_id_fk",
      cell: (info) => info.getValue(),
      header: () => <span>Responsiva ID</span>,
    },
    {
      accessorFn: (row) => row.log_id,
      id: "log_id_action",
      cell: (info) => (
        <div className="text-center d-flex justify-content-center">
          <span
            className="fs-4 w-25 bg-green d-flex align-items-center justify-content-center link-light rounded pointer"
            style={{
              cursor: "pointer",
            }}
            onClick={() => handleRestoreFile(info.getValue())}
          >
            <IoIosReturnLeft />
          </span>
        </div>
      ),
      header: () => <span>Acción</span>,
    },
  ]);


  return <TableContainer data={data} columns={columns} />;
}
