import React, { useState } from "react";
import { Col, Form, Row, Button, ButtonGroup } from "react-bootstrap";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import { ModalFileFormContainer } from "../ModalFileForm/ModalFileFormContainer";
import { FailModalContainer } from "../../../common/Modals/FailModal/FailModalContainer";
import { SuccessModalContainer } from "../../../common/Modals/SuccessModal/SuccessModalContainer";
import { RxCross1 } from "react-icons/rx";
import { UserSelectionContainer } from "../UserSelection/UserSelectionContainer";
import { ModalResponsiveSelectContainer } from "../ModalResponsiveSelect/ModalResponsiveSelectContainer";
import { useNavigate } from "react-router-dom";
export function ResponsiveThirdFormView({
  schema,
  initialValues,
  handleSubmit,
  handleFileChange,
  handleAutoResponsive,
  handleNextResponsiveProcess,
  handleBeforeResponsiveProcess,
  isReadMode,
  isUpdateMode,
  isInsertMode,
  isRenewMode,
  isThird,
}) {
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSucessModal] = useState(false);
  const [showResponsiveNextSelectModal, setShowResponsiveNextSelectModal] =
    useState(false);
  const [showResponsiveBeforeSelectModal, setShowResponsiveBeforeSelectModal] =
    useState(false);
  const [showFileModal, setShowFileModal] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  const [servers, setServers] = useState([]);
  console.log("INIT: ", initialValues);
  const navigate = useNavigate();

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
    navigate("/Files");
  };

  const handleShowResponsiveNextSelectModal = () => {
    setShowResponsiveNextSelectModal(true);
  };

  const handleCloseResponsiveNextSelectModal = () => {
    setShowResponsiveNextSelectModal(false);
  };

  const handleShowResponsiveBeforeSelectModal = () => {
    setShowResponsiveBeforeSelectModal(true);
  };

  const handleCloseResponsiveBeforeSelectModal = () => {
    setShowResponsiveBeforeSelectModal(false);
  };

  const handleCloseResponsiveSelectModal = () => {
    setShowResponsiveSelectModal(false);
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
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col>
                {isInsertMode && <h3>Nueva Responsiva F{isThird ? 3 : 4}</h3>}
                {isUpdateMode && (
                  <h3>
                    Actualizar Responsiva {initialValues.resp_id} F
                    {isThird ? 3 : 4}
                  </h3>
                )}
                {isReadMode && (
                  <h3>
                    Responsiva {initialValues.resp_id} F{isThird ? 3 : 4} -
                    <span style={{ fontStyle: "italic", fontSize: "1.4rem" }}>
                      {initialValues.state_id_fk === 1
                        ? "Activa"
                        : initialValues.state_id_fk === 2
                        ? "Notificar"
                        : initialValues.state_id_fk === 3
                        ? "Expirado"
                        : initialValues.state_id_fk === 4
                        ? "Notificado"
                        : initialValues.state_id_fk === 5
                        ? "Cancelado"
                        : initialValues.state_id_fk === 6
                        ? "Renovada"
                        : "Se desconoce"}
                    </span>
                  </h3>
                )}
                {isRenewMode && (
                  <h3>
                    Renovar Responsiva {initialValues.resp_id} F
                    {isThird ? 3 : 4}
                  </h3>
                )}
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
              <Form.Group as={Col} md="12" controlId="validationFormikRemedy">
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
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="12" controlId="validationFormikUserName">
                <Form.Label>Usuario Servidor</Form.Label>

                <UserSelectionContainer
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  values={values}
                  touched={touched}
                  errors={errors}
                  isReadMode={isReadMode}
                  isSubmit={isSubmit}
                  //usersServersValues={usersServersValues}
                />

                {/*<Select
                  placeholder="User Name"
                  name="user_name"
                  value={usersServersValues.find(
                    (option) => option.label === values.user_name
                  )}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setFieldValue("user_name", selectedOption.value);
                    } else {
                      setFieldValue("user_name", values.user_name);
                    }
                  }}
                  options={usersServersValues}
                  isDisabled={isSubmit || isReadMode} // Disable while submitting
                  isClearable
                  isSearchable
                  //onBlur={handleBlur('user_name')}
                  classNamePrefix="select"
                />
                */}
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
              </Form.Group>
            </Row>

            {isThird ? (
              <FieldArray name="servers">
                {({ insert, remove, push }) => (
                  <>
                    {values.servers.length > 0 &&
                      values.servers.map((server, index) => (
                        <>
                          {(isUpdateMode || isInsertMode || isRenewMode) && (
                            <Row>
                              <Col className="d-flex justify-content-end">
                                {index !== 0 && (
                                  <RxCross1
                                    onClick={() => remove()}
                                    className="exit-cross-button"
                                  />
                                )}
                              </Col>
                            </Row>
                          )}
                          <Row className="mb-3" key={index}>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId={`validationFormikWindowsServer.${index}`}
                            >
                              <Form.Label>Hostname</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Windows Server"
                                name={`servers.${index}.hostname`}
                                value={server.hostname}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.hostname &&
                                  !!errors.servers?.[index]?.hostname
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].hostname &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].hostname &&
                                  errors.servers[index].hostname}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId={`validationFormikDomain.${index}`}
                            >
                              <Form.Label>Dominio</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Dominio"
                                name={`servers.${index}.domain_server`}
                                value={server.domain_server}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.domain_server &&
                                  !!errors.servers?.[index]?.domain_server
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].domain_server &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].domain_server &&
                                  errors.servers[index].domain_server}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId={`validationFormikAccount.${index}`}
                            >
                              <Form.Label>Dirección IP</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Dirección IP"
                                name={`servers.${index}.ip_address`}
                                value={server.ip_address}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.ip_address &&
                                  !!errors.servers?.[index]?.ip_address
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].ip_address &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].ip_address &&
                                  errors.servers[index].ip_address}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                        </>
                      ))}
                    {(isUpdateMode || isInsertMode || isRenewMode) && (
                      <Button
                        type="button"
                        className="secondary mb-3"
                        onClick={() =>
                          push({
                            hostname: "",
                            domain_server: "",
                            ip_address: "",
                          })
                        }
                      >
                        Agregar Servidor
                      </Button>
                    )}
                  </>
                )}
              </FieldArray>
            ) : (
              <FieldArray name="servers">
                {({ insert, remove, push }) => (
                  <>
                    {values.servers.length > 0 &&
                      values.servers.map((server, index) => (
                        <>
                          {(isUpdateMode || isInsertMode) && (
                            <Row>
                              <Col className="d-flex justify-content-end">
                                {index !== 0 && (
                                  <RxCross1
                                    onClick={() => remove()}
                                    className="exit-cross-button"
                                  />
                                )}
                              </Col>
                            </Row>
                          )}
                          <Row className="mb-3" key={index}>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId={`validationFormikWindowsServer.${index}`}
                            >
                              <Form.Label>Marca</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Marca"
                                name={`servers.${index}.brand`}
                                value={server.brand}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.brand &&
                                  !!errors.servers?.[index]?.brand
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].brand &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].brand &&
                                  errors.servers[index].brand}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId={`validationFormikDomain.${index}`}
                            >
                              <Form.Label>Modelo</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Modelo"
                                name={`servers.${index}.model`}
                                value={server.model}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.model &&
                                  !!errors.servers?.[index]?.model
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].model &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].model &&
                                  errors.servers[index].model}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId={`validationFormikAccount.${index}`}
                            >
                              <Form.Label>Numero Serial</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Número Serial"
                                name={`servers.${index}.serial_number`}
                                value={server.serial_number}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.serial_number &&
                                  !!errors.servers?.[index]?.serial_number
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].serial_number &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].serial_number &&
                                  errors.servers[index].serial_number}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId={`validationFormikAccount.${index}`}
                            >
                              <Form.Label>Ubicación</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Ubicación"
                                name={`servers.${index}.location`}
                                value={server.location}
                                disabled={isSubmit || isReadMode}
                                onChange={handleChange}
                                isInvalid={
                                  touched.servers?.[index]?.location &&
                                  !!errors.servers?.[index]?.location
                                }
                              />

                              <Form.Control.Feedback type="invalid">
                                {errors &&
                                  errors.servers &&
                                  errors.servers[index] &&
                                  errors.servers[index].location &&
                                  touched &&
                                  touched.servers &&
                                  touched.servers[index] &&
                                  touched.servers[index].location &&
                                  errors.servers[index].location}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                        </>
                      ))}
                    {(isUpdateMode || isInsertMode || isRenewMode) && (
                      <Button
                        type="button"
                        className="secondary mb-3"
                        onClick={() =>
                          push({
                            brand: "",
                            model: "",
                            serial_number: "",
                            location: "",
                          })
                        }
                      >
                        Agregar Servidor
                      </Button>
                    )}
                  </>
                )}
              </FieldArray>
            )}
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
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue(
                      "end_date",
                      e.target.value
                        ? new Date(
                            new Date(e.target.value).setFullYear(
                              new Date(e.target.value).getFullYear() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        : e.target.value
                    );
                  }}
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
                  //onChange={handleChange}
                  isInvalid={touched.end_date && !!errors.end_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/** 
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
            */}
            {!isReadMode && (
              <Row className="mb-3">
                <Form.Group md="12">
                  <Form.Label>File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
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
            )}
            {(isInsertMode || isUpdateMode || isReadMode) && (
              <Row className="mb-3">
                <Form.Group as={Col} sm={12} md={6}>
                  <Form.Label>Responsiva Anterior</Form.Label>
                  <Row>
                    <Col md={12}>
                      <Form.Control
                        className="mb-3"
                        type="text"
                        disabled
                        placeholder="Responsiva anterior..."
                        name="before_responsive_id"
                        value={values.before_responsive_id}
                      />
                    </Col>
                  </Row>

                  <ButtonGroup className="d-flex">
                    {!isReadMode && (
                      <Button
                        type="button"
                        onClick={() => handleShowResponsiveBeforeSelectModal()}
                      >
                        Seleccionar
                      </Button>
                    )}
                    {!isReadMode && values.before_responsive_id && (
                      <Button
                        type="button"
                        className="flex-grow-1"
                        onClick={() =>
                          setFieldValue("before_responsive_id", "")
                        }
                      >
                        Eliminar
                      </Button>
                    )}
                    {values.before_responsive_id && (
                      <Button
                        type="button"
                        className="flex-grow-1"
                        onClick={() => {
                          window.open(
                            `/FilesThirdForm/${values.before_responsive_id}`,
                            "_blank"
                          );
                        }}
                      >
                        Visualizar
                      </Button>
                    )}
                  </ButtonGroup>
                </Form.Group>
                <Form.Group as={Col} sm={12} md={6}>
                  <Form.Label>Responsiva Posterior</Form.Label>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    disabled
                    placeholder="Responsiva posterior..."
                    name="after_responsive_id"
                    onClick={() => handleShowResponsiveNextSelectModal()}
                    value={values.after_responsive_id}
                  />
                  <ButtonGroup className="d-flex">
                    {!isReadMode && (
                      <Button
                        className="flex-grow-1"
                        type="button"
                        onClick={() => handleShowResponsiveNextSelectModal()}
                      >
                        Seleccionar
                      </Button>
                    )}
                    {!isReadMode && values.after_responsive_id && (
                      <Button
                        type="button"
                        className="flex-grow-1"
                        onClick={() => setFieldValue("after_responsive_id", "")}
                      >
                        Eliminar
                      </Button>
                    )}
                    {values.after_responsive_id && (
                      <Button
                        type="button"
                        className="flex-grow-1"
                        onClick={() => {
                          window.open(
                            `/FilesThirdForm/${values.after_responsive_id}`,
                            "_blank"
                          );
                        }}
                      >
                        Visualizar
                      </Button>
                    )}
                  </ButtonGroup>
                </Form.Group>
              </Row>
            )}
            {initialValues.state_id_fk === 5 && (
              <Row>
                <Form.Label>Motivo de Cancelación</Form.Label>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    disabled
                    value={initialValues.comment}
                  />
                </Form.Group>
              </Row>
            )}
            <Row>
              {isInsertMode && <Button type="submit">Enviar</Button>}
              {isUpdateMode && <Button type="submit">Actualizar</Button>}
              {isRenewMode && <Button type="submit">Renovar</Button>}
            </Row>
            <ModalResponsiveSelectContainer
              handleClose={handleCloseResponsiveNextSelectModal}
              showModal={showResponsiveNextSelectModal}
              handleSelectProcess={handleNextResponsiveProcess}
              isNext
              isThird={isThird ?? false}
              setFieldValue={setFieldValue}
            />
            <ModalResponsiveSelectContainer
              handleClose={handleCloseResponsiveBeforeSelectModal}
              showModal={showResponsiveBeforeSelectModal}
              handleSelectProcess={handleBeforeResponsiveProcess}
              isBefore
              isThird={isThird ?? false}
              setFieldValue={setFieldValue}
            />
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
