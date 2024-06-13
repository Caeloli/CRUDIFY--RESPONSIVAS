import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import { RxCross1 } from "react-icons/rx";
import "./ServerForm.scss";
export function ServerFormView({
  schema,
  initialValues,
  isReadMode,
  isUpdateMode,
  isInsertMode,
  handlePopServer,
  handleServerSubmit,
}) {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, actions) => {
      }}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3 py-3 rounded server-form ">
            <Row>
              <Col className="d-flex justify-content-end">
                <RxCross1
                  onClick={handlePopServer}
                  className="exit-cross-button"
                />
              </Col>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                md="4"
                controlId="validationFormikWindowsServer"
              >
                <Form.Label>Windows Server</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Windows Server"
                  name="windows_server"
                  value={values.windows_server}
                  disabled={isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.windows_server && !!errors.windows_server}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.windows_server}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikDomain">
                <Form.Label>Domain</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Domain"
                  name="domain"
                  value={values.domain}
                  disabled={isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.domain && !!errors.domain}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.domain}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikAccount">
                <Form.Label>Account</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Account"
                  name="account"
                  value={values.account}
                  disabled={isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.account && !!errors.account}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.account}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
