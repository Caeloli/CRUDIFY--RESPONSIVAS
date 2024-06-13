import React, { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import { ModalFileFormVisual } from "../ModalFileForm/ModalFileFormVisual";
import { ModalFileFormContainer } from "../ModalFileForm/ModalFileFormContainer";
import { FailModalContainer } from "../../../common/Modals/FailModal/FailModalContainer";
import { SuccessModalContainer } from "../../../common/Modals/SuccessModal/SuccessModalContainer";
import { ServerFormContainer } from "./ServerForm/ServerFormContainer";
import { RxCross1 } from "react-icons/rx";
import Select from "react-select";
export function ResponsiveFourthFormView({
  schema,
  initialValues,
  usersServersValues,
  handleSubmit,
  handleFileChange,
  handleAutoResponsive,
  isReadMode,
  isUpdateMode,
  isInsertMode,
}) {
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSucessModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [servers, setServers] = useState([]);

  const handleShowFileModal = () => {
    setShowFileModal(true);
  };

  const handleCloseFileModal = () => {
    setShowFileModal(false);
  };

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
  };

  /*const handlePopServer = (index) => {
    setServers((prevServers) => {
      const updatedServers = [...prevServers];
      updatedServers.splice(index, 1); // Remove the server at the specified index
      return updatedServers;
    });
  };

  const handlePushServer = () => {
    const newServer = (
      <ServerFormContainer
        key={servers.length} // Add a unique key for each server component
        isInsertMode={isInsertMode}
        isReadMode={isReadMode}
        handlePopServer={() => handlePopServer(servers.lengths)}
        isUpdateMode={isUpdateMode}
      />
    );

    setServers((prevServers) => [...prevServers, newServer]);
  };*/


  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={async (values, actions) => {
          await setIsSubmit(true);
          try {
            if (await handleSubmit(values, actions)) {
              setShowSucessModal(!showSuccessModal);
            } else {
              setShowFailModal(!showFailModal);
            }
          } catch (error) {
            console.error("An error occurred during form submission:", error);
            // Handle error as needed, e.g., show an error modal
          }
          await setIsSubmit(false);
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col>
                <h3>Responsiva</h3>
              </Col>
              {(isInsertMode || isUpdateMode) && (
                <>
                  <Col>
                    <Button onClick={() => handleShowFileModal()}>
                      Automática
                    </Button>
                  </Col>
                </>
              )}
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationFormikRemedy">
                <Form.Label>Remedy</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Remedy"
                  name="remedy"
                  value={values.remedy}
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.remedy && !!errors.remedy}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.remedy}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormikToken">
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
              <Form.Group as={Col} md="4" controlId="validationFormikUserName">
                <Form.Label>User Name</Form.Label>
                <Select 
                placeholder="User Name"
                name="user_name"
                value={{ label: values.user_name, value: values.user_name }}
                onChange={(option) => setFieldValue('user_name', option.value)}
                options={usersServersValues}
                isDisabled={isSubmit || isReadMode} // Disable while submitting
                isClearable
                isSearchable
                //onBlur={handleBlur('user_name')}
                classNamePrefix="select"
                />
                {/*<Form.Control
                  type="text"
                  placeholder="User Name"
                  name="user_name"
                  value={values.user_name}
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.user_name && !!errors.user_name}
                />
              */}
                <Form.Control.Feedback type="invalid">
                  {errors.user_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikEmail">
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
              <Form.Group as={Col} md="4" controlId="validationFormikPhone">
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
            <FieldArray name="servers">
              {({ insert, remove, push }) => (
                <>
                  {values.servers.length > 0 &&
                    values.servers.map((server, index) => (
                      <>
                        {(isUpdateMode || isInsertMode) && (
                          <Row>
                            <Col className="d-flex justify-content-end">
                              <RxCross1
                                onClick={() => remove()}
                                className="exit-cross-button"
                              />
                            </Col>
                          </Row>
                        )}
                        <Row className="mb-3" key={index}>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId={`validationFormikWindowsServer.${index}`}
                          >
                            <Form.Label>Windows Server</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Windows Server"
                              name={`servers.${index}.windows_server`}
                              value={server.windows_server}
                              disabled={isSubmit || isReadMode}
                              onChange={handleChange}
                              isInvalid={
                                touched.servers?.[index]?.windows_server &&
                                !!errors.servers?.[index]?.windows_server
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors &&
                                errors.servers &&
                                errors.servers[index] &&
                                errors.servers[index].windows_server &&
                                touched &&
                                touched.servers &&
                                touched.servers[index] &&
                                touched.servers[index].windows_server &&
                                errors.servers[index].windows_server}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId={`validationFormikDomain.${index}`}
                          >
                            <Form.Label>Domain</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Domain"
                              name={`servers.${index}.domain`}
                              value={server.domain}
                              disabled={isSubmit || isReadMode}
                              onChange={handleChange}
                              isInvalid={
                                touched.servers?.[index]?.domain &&
                                !!errors.servers?.[index]?.domain
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors &&
                                errors.servers &&
                                errors.servers[index] &&
                                errors.servers[index].domain &&
                                touched &&
                                touched.servers &&
                                touched.servers[index] &&
                                touched.servers[index].domain &&
                                errors.servers[index].domain}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId={`validationFormikAccount.${index}`}
                          >
                            <Form.Label>Account</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Account"
                              name={`servers.${index}.account`}
                              value={server.account}
                              disabled={isSubmit || isReadMode}
                              onChange={handleChange}
                              isInvalid={
                                touched.servers?.[index]?.account &&
                                !!errors.servers?.[index]?.account
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors &&
                                errors.servers &&
                                errors.servers[index] &&
                                errors.servers[index].account &&
                                touched &&
                                touched.servers &&
                                touched.servers[index] &&
                                touched.servers[index].account &&
                                errors.servers[index].account}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                      </>
                    ))}
                  {(isUpdateMode || isInsertMode) && (
                    <Button
                      type="button"
                      className="secondary mb-3"
                      onClick={() =>
                        push({ windows_server: "", domain: "", account: "" })
                      }
                    >
                      Agregar Servidor
                    </Button>
                  )}
                </>
              )}
            </FieldArray>

            {/* <Row className="mb-3">
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
                  disabled={isSubmit || isReadMode}
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
                  disabled={isSubmit || isReadMode}
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
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.account && !!errors.account}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.account}
                </Form.Control.Feedback>
              </Form.Group>
            </Row> */}

            {/**servers &&
              servers.map((serverContainer) => {
                return serverContainer;
              }) **/}

            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikFileFormat"
              >
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha Inicio"
                  name="start_date"
                  value={values.start_date}
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.start_date && !!errors.start_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikFileFormat"
              >
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha Inicio"
                  name="end_date"
                  value={values.end_date}
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.end_date && !!errors.end_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                md="6"
                controlId="validationFormikFileFormat"
              >
                <Form.Label>File Format</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="File Format"
                  name="file_format"
                  value={values.file_format}
                  disabled={isSubmit || isReadMode}
                  onChange={handleChange}
                  isInvalid={touched.file_format && !!errors.file_format}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.file_format}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group md="12">
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  required
                  name="file"
                  disabled={isSubmit || isReadMode}
                  onChange={(evt) => {
                    handleChange(evt);
                    handleFileChange(evt);
                  }}
                  isInvalid={touched.file && !!errors.file}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.file}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              {isInsertMode && <Button type="submit">Enviar</Button>}
              {isUpdateMode && <Button type="submit">Actualizar</Button>}
            </Row>
          </Form>
        )}
      </Formik>
      <ModalFileFormContainer
        handleClose={handleCloseFileModal}
        showModal={showFileModal}
        handleAutoResponsive={handleAutoResponsive}
      />
      <FailModalContainer
        handleClose={handleCloseFailModal}
        showModal={showFailModal}
      />
      <SuccessModalContainer
        handleClose={handleCloseSuccessModal}
        showModal={showSuccessModal}
      />
    </>
  );
}
