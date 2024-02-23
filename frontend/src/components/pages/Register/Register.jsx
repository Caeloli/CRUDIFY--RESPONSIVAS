import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import * as yup from "yup";
import { postRequestRegister } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";
import { SuccessModalContainer } from "../../common/Modals/SuccessModal/SuccessModalContainer";
export function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(1);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSucessModal] = useState(false);
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

  const handleSubmit = async (values, actions) => {
    console.log("Envio de register");
    const result = await postRequestRegister({ ...values, userType });
    console.log("resultado: ", result);
    if (!result.error) {
      return true; // Success
    } else {
      return false; // Error
    }
  };

  const RegisterSchema = yup.object().shape({
    user: yup
      .string()
      .email("Usuario debe ser un email válido")
      .required("Usuario es un campo obligatorio"),
  });

  const initialValues = {
    user: "",
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
              <h4>Está a punto de crear una nueva cuenta</h4>
              <p>
                Por favor elija un correo electrónico activo con el que recibirá
                su contraseña
              </p>
            </Row>
            <Formik
              validationSchema={RegisterSchema}
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
                      controlId="validationFormikUser"
                    >
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Correo Electrónico"
                        name="user"
                        value={values.user}
                        onChange={handleChange}
                        disabled={isSubmit}
                        isInvalid={touched.user && !!errors.user}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.user}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="12"
                      controlID="validationFormikType"
                    >
                      <Form.Label>Tipo de Usuario</Form.Label>
                      <Form.Select
                        value={userType}
                        disabled={isSubmit}
                        onChange={(e) => setUserType(e.target.value)}
                      >
                        <option value={1}>Miembro Equipo</option>
                        <option value={2}>Miembro Administrador</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <Button className="mb-3" type="submit">
                        Generar Cuenta
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
          "La operación se ha completado con éxito. Por favor, tenga en cuenta que su solicitud está pendiente de aprobación por parte de un administrador."
        }
      />
    </>
  );
}
