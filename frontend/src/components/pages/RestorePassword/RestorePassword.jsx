import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import * as yup from "yup";
import { postRestoreLoginByEmail } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";
import { SuccessModalContainer } from "../../common/Modals/SuccessModal/SuccessModalContainer";
export function RestorePassword() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(1);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSucessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [failModalMessage, setFailModalMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const handleShowFailModal = () => {
    setShowFailModal(true);
  };

  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  const handleShowSuccessModal = () => {
    setShowSucessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSucessModal(false);
    navigate("/Login");
  };

  const handleSuccessModalMessage = (msg) => {
    setSuccessModalMessage(msg);
  }

  const handleFailModalMessage = (msg) => {
    setFailModalMessage(msg)
  }

  const handleSubmit = async (values, actions) => {
    const result = await postRestoreLoginByEmail(values);
    if (!result.error) {
      handleSuccessModalMessage(result.message);
      return true; // Success
    } else {
      handleFailModalMessage(result.error);
      return false; // Error
    }
  };

  const RestoreSchema = yup.object().shape({
    email: yup
      .string()
      .email("Usuario debe ser un email válido")
      .required("Usuario es un campo obligatorio"),
  });

  const initialValues = {
    email: "",
  };

  return (
    <>
      <Row className="overflow-hidden m-0 link-light bg-cherry">
        <Col
          sm={12}
          md={4}
          className="d-flex align-items-center my-0 mx-auto min-vh-100"
        >
          <Container>
            <Row>
              <h1 className="fw-bold">PMX_RESP</h1>
              <h4>Está a punto de restaurar su contraseña</h4>
              <p>
                Por favor escriba su correo electrónico activo para poder
                restaurar su contraseña.
              </p>
            </Row>
            <Formik
              validationSchema={RestoreSchema}
              onSubmit={async (values, actions) => {
                await setIsSubmit(true);
                try {
                  if (await handleSubmit(values, actions)) {
                    setShowSucessModal(!showSuccessModal);
                  } else {
                    setShowFailModal(!showFailModal);
                  }
                } catch (error) {
                  console.error(
                    "An error occurred during form submission:",
                    error
                  );
                  // Handle error as needed, e.g., show an error modal
                }
                await setIsSubmit(false);
              }}
              initialValues={initialValues}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="12"
                      controlId="validationFormikemail"
                    >
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Correo Electrónico"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        disabled={isSubmit}
                        isInvalid={touched.email && !!errors.email}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Button
                        className="mb-3"
                        type="submit"
                        disabled={isSubmit}
                      >
                        Iniciar Sesión
                      </Button>
                    </Form.Group>
                  </Row>
                </Form>
              )}
            </Formik>
          </Container>
        </Col>
      </Row>
      <FailModalContainer
        handleClose={handleCloseFailModal}
        showModal={showFailModal}
      />
      <SuccessModalContainer
        handleClose={handleCloseSuccessModal}
        showModal={showSuccessModal}
        message={
          successModalMessage
        }
      />
    </>
  );
}
