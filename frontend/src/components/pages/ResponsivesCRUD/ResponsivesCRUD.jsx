import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  deleteResponsive,
  getAllResponsive,
  putResponsive,
} from "../../../services/api";
import { DeleteModalContainer } from "../../common/Modals/DeleteModal/DeleteModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";
import { FaArrowRotateRight } from "react-icons/fa6";
import ReactSelect from "react-select";
import { DebouncedInput } from "../../common/Tables/Filters/Inputs/DebouncedInput";
import { DebouncedSelect } from "../../common/Tables/Filters/Inputs/DebouncedSelect";
import { MdOutlineCancel } from "react-icons/md";
import { CancelModalContainer } from "../../common/Modals/CancelModal/CancelModalContainer";

function ResponsiveTableContainer({
  handleView,
  handleEdit,
  handleDelete,
  handleCancel,
  handleRestore,
  responsiveData,
  visibleData,
}) {
  //const [data, setData] = useState(() => makeData(10));
  //const refreshData = () => setData(() => makeData(10));

  const columns = useMemo(
    () => [
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
                ? "Activa"
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
              <Col md={3}>
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
                <Col md={3}>
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
                  <Col md={3}>
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
                  <Col md={3}>
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
      filter={ResponsiveFilter}
      rowSelectionObject={{
        enableRowSelection: false,
        enableSubRowSelection: false,
        enableMultiRowSelection: false,
      }}
      filterSelectionObject={{
        enableColumnFilters: true,
      }}
      visibleData={visibleData}
    />
  ) : null;
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
            console.log("El valor que retorna es: ", value);
            column.setFilterValue(value);
          }}
          menuPosition="fixed"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",
              borderRadius: "0.3rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,

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
        style={{ height: "2.5rem", borderRadius: "0.3rem" }}
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
          menuPosition="fixed"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontWeight: "normal",
              height: "2.5rem",
              borderRadius: "0.3rem",
            }),
            menuList: (baseStyles, state) => ({
              ...baseStyles,

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
          style={{ height: "2.5rem", borderRadius: "0.3rem" }}
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
          style={{ height: "2.5rem", borderRadius: "0.3rem" }}
        />
      </>
    );
  }
}

export function ResponsivesCRUD() {
  const [activeIDRegister, setActiveIDRegister] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [responsiveData, setResponsiveData] = useState(null);
  const [update, setUpdate] = useState(false);
  const downloadableData = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsives = await getAllResponsive();
        setResponsiveData(responsives);
        //downloadableData.current = responsives;
      } catch (error) {
        console.error("Error fetching responsives: ", error);
      }
    };

    fetchData();
  }, [update]);

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

  const handleCancel = async (values, actions) => {
    if (activeIDRegister) {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          resp_id: activeIDRegister,
          state_id_fk: 5,
          comment: values.comment,
        })
      );

      const result = await putResponsive(activeIDRegister, formData);

      if (!result.error) {
        setUpdate(!update);
      } else {
        console.log("Error, envío falso");
        setShowFailModal(true);
      }
    }

    setShowCancelModal(false);
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

  const handleShowCancelModal = (id) => {
    setActiveIDRegister(id);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setActiveIDRegister(null);
    setShowCancelModal(false);
  };

  const handleShowFailModal = () => {
    setShowFailModal(true);
  };

  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  const handleGenerateXLXS = () => {
    console.log("Data visible: ", downloadableData)
    return exportToExcelResponsivesCrud(downloadableData.current)
  }

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
                  <Button
                    onClick={() => handleGenerateXLXS()}
                  >
                    Generar .xlxs
                  </Button>
                )}
              </Col>
              <Col className="responsive-crud__btn gap-2">
                <Link to={"/FilesThirdForm"}>
                  <Button>Añadir F3</Button>
                </Link>
                <Link to={"/FilesFourthForm"}>
                  <Button>Añadir F4</Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <ResponsiveTableContainer
            handleCancel={handleShowCancelModal}
            handleEdit={handleEdit}
            handleView={handleView}
            handleRestore={handleRestore}
            visibleData={downloadableData}
            responsiveData={responsiveData}
          />
        </Row>
      </Container>
      <CancelModalContainer
        showModal={showCancelModal}
        handleClose={handleCloseCancelModal}
        handleProcessing={handleCancel}
      />
      <FailModalContainer
        handleClose={handleCloseFailModal}
        showModal={showFailModal}
      />
    </>
  );
}
