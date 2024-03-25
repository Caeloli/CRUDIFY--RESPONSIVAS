import { Formik } from "formik";
import React from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";

export function CancelModalView({
  showModal,
  handleClose,
  handleProcessing,
  schema,
  initialValues,
  message,
}) {
  return (
    <Modal show={showModal} onHide={handleClose} size="md" centered>
      <Formik
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          handleProcessing(values, actions);
        }}
        initialValues={initialValues}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          errors,
        }) => (
          <>
            <ModalHeader>
              <ModalTitle>Cancelar</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Row>
                <p>
                  {message ?? "¿Está seguro que desea cancelar este registro?"}
                </p>
              </Row>
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group
                    as={Col}
                    md="12"
                    controlId="validationFormikComment"
                  >
                    <Form.Label>Comentario</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Comentario de la cancelación..."
                      name="comment"
                      value={values.comment}
                      onChange={handleChange}
                      isInvalid={touched.comment && !!errors.comment}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.comment}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleSubmit}>Aceptar</Button>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}
