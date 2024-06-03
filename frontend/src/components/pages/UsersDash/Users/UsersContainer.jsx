import React, { useEffect, useMemo, useState } from "react";
import { FSPTableContainer } from "../../../common/Tables/FSPTable/FSPTableContainer";
import { deleteUser, getAllUsers } from "../../../../services/api";
import { FaTrash } from "react-icons/fa6";
import { Col, Container, Row } from "react-bootstrap";
import { decodeToken } from "../../../../func/func";
import { SuccessModalContainer } from "../../../common/Modals/SuccessModal/SuccessModalContainer";
import { FailModalContainer } from "../../../common/Modals/FailModal/FailModalContainer";
import { DebouncedInput } from "../../../common/Tables/Filters/Inputs/DebouncedInput";
import { DebouncedSelect } from "../../../common/Tables/Filters/Inputs/DebouncedSelect";

export function UsersContainer() {
  const [userData, setUserData] = useState(null);
  const [update, setUpdate] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [failModalMessage, setFailModalMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const info = decodeToken();
        const filteredUsers = users.filter(
          (user) => user.user_id !== info.user_id && user.is_active === true
        );
        setUserData(filteredUsers);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchData();
  }, [update]);

  const handleDelete = async (id) => {
    const result = await deleteUser(id);
    if (!result.error) {
      setUpdate((prevUpdate) => !prevUpdate);
      setShowSuccessModal(true);
    } else {
      setFailModalMessage(result.error);
      setShowFailModal(true);
    }
  };

  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.user_id,
        id: "user_id",
        cell: (info) => info.getValue(),
        header: () => <span>ID</span>,
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        cell: (info) => info.getValue(),
        header: () => <span>E-Mail</span>,
      },
      {
        accessorFn: (row) => row.user_type_id_fk,
        id: "user_type_id_fk",
        cell: (info) =>
          info.getValue() == 1
            ? "Operador"
            : info.getValue() == 2
            ? "Administrador"
            : "Desconocido",
        header: () => <span>Formato</span>,
        footer: (props) => props.column.user_type_id_fk,
      },
      {
        accessorFn: (row) => row.user_id,
        header: () => <span>Acciones</span>,
        id: "actions",
        cell: (info) => {
          return (
            <Row>
              <Col md={12}>
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

  return (
    userData && (
      <Container>
        <FSPTableContainer
          data={userData}
          columns={columns}
          fixedColumns={[]}
          tableStyles={{ }}
          filterSelectionObject={{
            enableColumnFilters: true,
          }}
          filter={UserFilter}
        />
        <SuccessModalContainer
          handleClose={handleCloseSuccessModal}
          showModal={showSuccessModal}
        />
        <FailModalContainer
          handleClose={handleCloseFailModal}
          showModal={showFailModal}
          message={failModalMessage}
        />
      </Container>
    )
  );
}

function UserFilter({ column, table }) {
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

  if (column.id === "user_id") {
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
  } else if (column.id === "user_type_id_fk") {
    const options = [
      { value: 1, label: "Operadores" },
      { value: 2, label: "Administradores" },
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
