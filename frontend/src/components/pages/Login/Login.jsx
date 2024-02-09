import { Formik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import * as yup from "yup";
import { postLogin, verifyToken } from "../../../services/api";
import { useNavigate } from "react-router-dom";
export function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    console.log("Envio de login");
    const result = await postLogin(values);
    console.log("resultado: ", result);
    if (!result.error) {
      localStorage.setItem("jwt", result);
      navigate("/");
      return true; // Success
    } else {
      actions.setErrors({ password: "Usuario o contraseña incorrectos" });
      console.log("Error, envio falso");
      return false; // Error
    }
  };

  const LoginSchema = yup.object().shape({
    user: yup
      .string()
      .email("Usuario debe ser un email válido")
      .required("Usuario es un campo obligatorio"),
    password: yup
      .string()
      .required("Password es un campo obligatorio")
      .min(8, "La contraseña debe contener al menos 8 caracteres")
      .max(20, "La contraseña no debe exceder los 20 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%+*?&])[A-Za-z\d@$!%+*?&]/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un caracter especial"
      )
      .trim(),
  });

  const initialValues = {
    user: "",
    password: "",
  };

  return (
    <Row className="overflow-hidden m-0 link-light">
      <Col
        sm={12}
        md={4}
        className="d-flex align-items-center bg-cherry min-vh-100"
      >
        <Container>
          <Row>
            <h1 className="fw-bold">PMX_RESP</h1>
            <h4>Bienvenido al Sistema de Responsivas</h4>
          </Row>
          <Formik
            validationSchema={LoginSchema}
            onSubmit={async (values, actions) =>
              await handleSubmit(values, actions)
            }
            initialValues={initialValues}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationFormikUser">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Usuario"
                      name="user"
                      value={values.user}
                      onChange={handleChange}
                      isInvalid={touched.user && !!errors.user}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.user}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="12" controlId="validationFormikUser">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && !!errors.password}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    <Button className="mb-3" type="submit">
                      Iniciar Sesión
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </Container>
      </Col>
      <Col
        sm={0}
        md={8}
        className="bg-cherry-light d-flex align-items-center justify-content-center"
      >
        <Image className="w-25" src="./assets/imgs/file_storage.svg" />
      </Col>
    </Row>
  );
}
