import React, { useEffect, useMemo, useState } from "react";
import { ModalResponsiveSelectView } from "./ModalResponsiveSelectView";
import { getAllResponsive } from "../../../../services/api";
import { DebouncedSelect } from "../../../common/Tables/Filters/Inputs/DebouncedSelect";
import { DebouncedInput } from "../../../common/Tables/Filters/Inputs/DebouncedInput";
import { Col, Row } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

export function ModalResponsiveSelectContainer({
  showModal,
  handleClose,
  handleSelectProcess,
  setFieldValue,
  isBefore,
  isNext,
  isThird,
  message,
}) {
  const { fileID } = useParams();
  const [responsiveData, setResponsiveData] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsives = await getAllResponsive();
        const filteredResponsives = responsives.filter((responsive) => {
          if (isThird) {
            return (
              responsive.state_id_fk !== 5 &&
              responsive.state_id_fk !== 6 &&
              responsive.resp_id !== parseInt(fileID) &&
              responsive.file_format === 3
            );
          } else {
            return (
              responsive.state_id_fk !== 5 &&
              responsive.state_id_fk !== 6 &&
              responsive.resp_id !== parseInt(fileID) &&
              responsive.file_format === 4
            );
          }
        });

        setResponsiveData(filteredResponsives);
      } catch (error) {
        console.error("Error fetching responsives: ", error);
      }
    };

    fetchData();
  }, [fileID]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <></>
          /* <input
                type="checkbox"
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              /> */
        ),
        cell: ({ row }) => (
          <div className={"px-1"}>
            <input
              type="checkbox"
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: () => <></>,
        id: "none",
        columns: [
          {
            accessorFn: (row) => row.resp_id,
            id: "resp_id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
          },
        ],
      },
      {
        header: () => <span>Estado</span>,
        id: "state",
        columns: [
          {
            accessorFn: (row) => row.state_id_fk,
            id: "state_id_fk",
            sortable: false,
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
                : state_id === 5
                ? "Cancelado"
                : state_id === 6
                ? "Renovada"
                : "Se desconoce";
            },
            header: "Estado",
          },
          {
            accessorFn: (row) => row.start_date,
            id: "start_date",
            cell: (info) => info.getValue().split("T")[0],
            header: () => <span>Fecha Inicio</span>,
          },
          {
            accessorFn: (row) => row.end_date,
            id: "end_date",
            cell: (info) => info.getValue().split("T")[0],
            header: () => <span>Fecha Fin</span>,
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
        ],
      },
      {
        header: () => <></>,
        id: "none",
        columns: [
          {
            accessorFn: (row) => row.file_format,
            id: "file_format",
            cell: (info) => info.getValue(),
            enableSorting: false,
            header: () => <span>Formato</span>,
            footer: (props) => props.column.file_format,
          },
        ],
      },

      {
        accessorFn: (row) => row,
        header: () => <span>Acciones</span>,
        enableSorting: false,
        id: "actions",
        cell: (info, props) => {
          return (
            <Row>
              <Col md={12}>
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
            </Row>
          );
        },
      },
    ],
    []
  );

  //const navigate = useNavigate();

  const handleView = (id, format) => {
    if (format === 3) window.open(`/FilesThirdForm/${id}`, "_blank");
    else if (format === 4) window.open(`/FilesFourthForm/${id}`, "_blank");
  };

  const handleProcessing = () => {
    if (isBefore)
      setFieldValue("before_responsive_id", Object.keys(rowSelection)[0]);
    else if (isNext)
      setFieldValue("after_responsive_id", Object.keys(rowSelection)[0]);
  };

  return (
    responsiveData && (
      <ModalResponsiveSelectView
        handleClose={handleClose}
        showModal={showModal}
        message={message}
        handleProcessing={handleProcessing}
        columns={columns}
        data={responsiveData}
        filter={ResponsiveFilter}
        pRowS
        rowSelectionObject={{
          enableRowSelection: true,
          enableSubRowSelection: false,
          enableMultiRowSelection: false,
        }}
        pRowSelection={rowSelection}
        pSetRowSelection={setRowSelection}
      />
    )
  );
}

function ResponsiveFilter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  if (column.id === "start_date" || column.id === "end_date") {
    const columnFilterValue = column.getFilterValue();
    // Extract years from date strings
    const years = sortedUniqueValues.map((sortedValue) => {
      const date = new Date(sortedValue); // Assuming start_date is the property containing the date
      return date.getFullYear();
    });

    // Remove duplicate years
    const uniqueYears = [...new Set(years)];

    // Format years as options for React-Select
    const options = uniqueYears.map((year) => ({ value: year, label: year }));

    return (
      <>
        <DebouncedSelect
          options={options}
          isClearable
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          onChange={(value) => {
            column.setFilterValue(value);
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",
              borderRadius: "0.3rem",
              fontSize: "0.7rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,
              fontSize: "0.7rem",
              fontWeight: "normal",
            }),
          }}
        />
      </>
    );
  } else if (column.id === "resp_id") {
    return (
      <DebouncedInput
        type="text"
        value={columnFilterValue?.[0] ?? ""}
        onChange={(value) => column.setFilterValue([value, value])}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-100 border  rounded"
        list={column.id + "list"}
        style={{ height: "2.5rem", borderRadius: "0.3rem", fontSize: "0.7rem" }}
      />
    );
  } else if (column.id === "state_id_fk") {
    const options = [
      { value: 1, label: "Activa" },
      { value: 2, label: "Notificar" },
      { value: 3, label: "Expirada" },
      { value: 4, label: "Notificada" },
      { value: 5, label: "Cancelado" },
      { value: 6, label: "Renovado" },
    ];

    return (
      <>
        <DebouncedSelect
          options={options}
          isClearable
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          onChange={(value) => {
            column.setFilterValue([value, value]);
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",
              borderRadius: "0.3rem",
              fontSize: "0.7rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,
              fontSize: "0.7rem",
              fontWeight: "normal",
            }),
          }}
        />
      </>
    );
  } else if (column.id === "file_format") {
    return (
      <>
        <datalist id={column.id + "list"}>
          <option value={3} />
          <option value={4} />
        </datalist>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) => column.setFilterValue([value, value])}
          placeholder={`F... ${
            column.getFacetedMinMaxValues()
              ? `(${column.getFacetedMinMaxValues()})`
              : ""
          }`}
          list={column.id + "list"}
          className="w-100 border  rounded"
          style={{
            height: "2.5rem",
            borderRadius: "0.3rem",
            fontSize: "0.7rem",
          }}
        />
      </>
    );
  } else if (column.id === "actions") {
    return null;
  } else {
    return (
      <>
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value, index) => (
            <option value={value} key={index} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={columnFilterValue ?? ""}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-100 border  rounded"
          list={column.id + "list"}
          style={{
            height: "2.5rem",
            borderRadius: "0.3rem",
            fontSize: "0.7rem",
          }}
        />
      </>
    );
  }
}
