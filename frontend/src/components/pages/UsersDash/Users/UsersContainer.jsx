import React, { useEffect, useMemo, useState } from "react";
import { FSPTableContainer } from "../../../common/Tables/FSPTable/FSPTableContainer";
import { deleteUser, getAllUsers } from "../../../../services/api";
import { FaTrash } from "react-icons/fa6";
import { Col, Container, Row } from "react-bootstrap";
import { decodeToken } from "../../../../func/func";
import { SuccessModalContainer } from "../../../common/Modals/SuccessModal/SuccessModalContainer";
import { FailModalContainer } from "../../../common/Modals/FailModal/FailModalContainer";

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
          (user) => user.user_id !== info.user_id
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
      setUpdate(prevUpdate => !prevUpdate);
      setShowSuccessModal(true);
    } else {
      setFailModalMessage(result.error)
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
        cell: (info) => info.getValue(),
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
