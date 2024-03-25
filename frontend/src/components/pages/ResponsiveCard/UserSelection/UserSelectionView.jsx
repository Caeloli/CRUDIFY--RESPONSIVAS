import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { RxCross1 } from "react-icons/rx";

export function UserSelectionView({
  isNewUserServer,
  isExistentUserServer,
  handleNewClick,
  handleExistentClick,
  handleCancel,
  handleChange,
  handleUserSelect,
  setFieldValue,
  values,
  touched,
  errors,
  isSubmit,
  isReadMode,
  usersServersValues,
}) {
  return (
    <>
      {!isNewUserServer && !isExistentUserServer && (
        <Row className="d-flex justify-content-center gap-0">
          <Col sm={12} md={2}>
            <Button onClick={handleNewClick}>Nuevo</Button>
          </Col>
          <Col sm={12} md={2}>
            <Button onClick={handleExistentClick}>Existente</Button>
          </Col>
        </Row>
      )}
      {(isNewUserServer || isExistentUserServer) && (
        <>
          {!isReadMode && (
            <Row>
              <Col className="d-flex justify-content-end mb-3">
                <RxCross1
                  onClick={handleCancel}
                  className="exit-cross-button"
                />
              </Col>
            </Row>
          )}
          {isNewUserServer && (
            <Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationFormikToken">
                  <Form.Control
                    type="text"
                    placeholder="Nuevo Usuario"
                    name="user_name"
                    value={values.user_name}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={touched.user_name && !!errors.user_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.user_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationFormikToken">
                  <Form.Label>Token</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Token"
                    name="token"
                    value={values.token}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={touched.token && !!errors.token}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.token}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormikEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationFormikPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={values.phone}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={touched.phone && !!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormikImmediatelyChief"
                >
                  <Form.Label>Immediately Chief</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Immediately Chief"
                    name="immediately_chief"
                    value={values.immediately_chief}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={
                      touched.immediately_chief && !!errors.immediately_chief
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.immediately_chief}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormikEmailImmediatelyChief"
                >
                  <Form.Label>Email Jefe Inmediato</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Jefe Inmediato"
                    name="email_immediately_chief"
                    value={values.email_immediately_chief}
                    disabled={isSubmit || isReadMode}
                    onChange={handleChange}
                    isInvalid={
                      touched.email_immediately_chief &&
                      !!errors.email_immediately_chief
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.email_immediately_chief}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Row>
          )}
          {isExistentUserServer && (
            <Row>
              <Row className="mb-3">
                <CustomSelect
                  name="user_name"
                  options={usersServersValues}
                  handleUserSelect={handleUserSelect}
                  id="user_name"
                  placeholder="Usuario"
                  disabled={isSubmit || isReadMode}
                  isInvalid={touched.user_name && !!errors.user_name}
                />
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="12" controlId="validationFormikToken">
                  <Form.Label>Token</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Token"
                    name="token"
                    value={values.token}
                    disabled={true}
                    onChange={handleChange}
                    isInvalid={touched.token && !!errors.token}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.token}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationFormikEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    disabled={true}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationFormikPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    value={values.phone}
                    disabled={true}
                    onChange={handleChange}
                    isInvalid={touched.phone && !!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormikImmediatelyChief"
                >
                  <Form.Label>Immediately Chief</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Immediately Chief"
                    name="immediately_chief"
                    value={values.immediately_chief}
                    disabled={true}
                    onChange={handleChange}
                    isInvalid={
                      touched.immediately_chief && !!errors.immediately_chief
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.immediately_chief}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormikEmailImmediatelyChief"
                >
                  <Form.Label>Email Jefe Inmediato</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Jefe Inmediato"
                    name="email_immediately_chief"
                    value={values.email_immediately_chief}
                    disabled={true}
                    onChange={handleChange}
                    isInvalid={
                      touched.email_immediately_chief &&
                      !!errors.email_immediately_chief
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.email_immediately_chief}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Row>
          )}
        </>
      )}
    </>
  );
}
