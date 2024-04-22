import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Row,
} from "react-bootstrap";
import { TableContainer } from "../../common/Tables/Table/TableContainer";
import * as yup from "yup";
import { Formik } from "formik";
import {
  deleteEmailNotify,
  getAllEmailNotify,
  getNotificationBot,
  postEmailNotify,
  putNotificationBot,
  verifyTelegramToken,
} from "../../../services/api";
import { FaEye, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { SuccessModalContainer } from "../../common/Modals/SuccessModal/SuccessModalContainer";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";

export function Notifications() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSubmitToken, setIsSubmitToken] = useState(false);
  const [isSubmitGroup, setIsSubmitGroup] = useState(false);
  const [isSubmitTime, setIsSubmitTime] = useState(false);
  const [update, setUpdate] = useState(false);
  const [botData, setBotData] = useState(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const result = await getNotificationBot();
        setBotData(result);
      } catch (error) {
        setBotData({
          bot_id: "",
          chat_group_id: "",
          time: "00:00",
        });
      }
    };

    fetchNotificationData();
  }, [update]);

  const APISchema = yup.object().shape({
    bot_id: yup.string().required("Se requiere un API Token"),
  });

  const handleAPIBotSubmit = async (values, actions) => {

    if (await verifyTelegramToken(values.bot_id)) {
      //console.log("El bot sí existe");
      const result = await putNotificationBot(values);
      if (!result.error) {
        return true; // Success
      } else {
        console.log("Error, envio falso");
        return false; // Error
      }
    } else {
      actions.setErrors({ bot_id: "El Token del bot no es válido" });
      return false;
    }
  };

  const BotGroupSchema = yup.object().shape({
    chat_group_id: yup.string().required("Se requiere grupo"),
  });

  const handleGroupIDSubmit = async (values, actions) => {
    const result = await putNotificationBot(values);
    if (!result.error) {
      return true; // Success
    } else {
      actions.setErrors({ chat_group_id: "El Grupo del bot no es válido" });
      console.log("Error, envio falso");
      return false; // Error
    }
  };

  const TimeSchema = yup.object().shape({
    notification_time: yup
      .string()
      .required("Time is required."),
  });

  const handleTimeSubmit = async (values, actions) => {
    const result = await putNotificationBot(values);
    if (!result.error) {
      return true; // Success
    } else {
      console.log("Error, envio falso");
      return false; // Error
    }
  };

 
  const handleCloseFailModal = () => {
    setShowFailModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    botData && (
      <Container>
        <h2>Notificaciones</h2>
        <Row className="mb-4">
          <Row>
            <h3>Telegram Bot</h3>
          </Row>
          <Row className="mb-3">
            <Row>
              <h5>API Token</h5>
            </Row>
            <Row>
              <Formik
                validationSchema={APISchema}
                onSubmit={async (values, actions) => {
                  await setIsSubmitToken(true);
                  try {
                    if (await handleAPIBotSubmit(values, actions)) {
                      setUpdate(!update);
                      setShowSuccessModal(!showSuccessModal);
                    } else {
                      //setShowFailModal(!showFailModal);
                    }
                  } catch (error) {
                    console.error(
                      "An error occurred during form submission:",
                      error
                    );
                    // Handle error as needed, e.g., show an error modal
                  }
                  await setIsSubmitToken(false);
                }}
                initialValues={{ bot_id: botData.bot_id }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group
                      as={Col}
                      md="12"
                      controlId="validationFormkiAPI"
                    >
                      <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Código API"
                          aria-label=""
                          name="bot_id"
                          aria-describedby=""
                          value={values.bot_id}
                          disabled={isSubmitToken}
                          onChange={handleChange}
                          isInvalid={touched.bot_id && !!errors.bot_id}
                        />
                        <Button type="submit" disabled={isSubmitToken}>
                          Subir
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.bot_id}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </Row>
          </Row>
          <Row className="mb-3">
            <Row>
              <h5>ID Grupo</h5>
            </Row>
            <Row>
              <Formik
                validationSchema={BotGroupSchema}
                onSubmit={async (values, actions) => {
                  await setIsSubmitGroup(true);
                  try {
                    if (await handleGroupIDSubmit(values, actions)) {
                      setUpdate(!update);
                      setShowSuccessModal(!showSuccessModal);
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
                  await setIsSubmitGroup(false);
                }}
                initialValues={{ chat_group_id: botData.chat_group_id }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <FormGroup as={Col} md="12">
                      <InputGroup>
                        <FormControl
                          type="group"
                          placeholder="Grupo ID"
                          aria-label=""
                          name="chat_group_id"
                          aria-describedby=""
                          value={values.chat_group_id}
                          disabled={isSubmitGroup}
                          onChange={handleChange}
                          isInvalid={touched.chat_group_id && !!errors.chat_group_id}
                        />
                        <Button type="submit" disabled={isSubmitGroup}>
                          Subir
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.chat_group_id}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </Row>
          </Row>
          <Row className="mb-3">
            <Row>
              <h5>Hora de Notificación</h5>
            </Row>
            <Row>
              <Formik
                validationSchema={TimeSchema}
                onSubmit={async (values, actions) => {
                  await setIsSubmitTime(true);
                  try {
                    if (await handleTimeSubmit(values, actions)) {
                      setUpdate(!update);
                      setShowSuccessModal(!showSuccessModal);
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
                  await setIsSubmitTime(false);
                }}
                initialValues={{ notification_time: botData.notification_time }}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <FormGroup>
                      <InputGroup>
                        <FormControl
                          type="time"
                          aria-label=""
                          aria-describedby=""
                          name="notification_time"
                          value={values.notification_time}
                          disabled={isSubmitTime}
                          onChange={handleChange}
                          isInvalid={touched.notification_time && !!errors.notification_time}
                        />
                        <Button type="submit" disabled={isSubmitTime}>
                          Subir
                        </Button>
                      </InputGroup>
                      <FormControl.Feedback type="invalid">
                        {errors.notification_time}
                      </FormControl.Feedback>
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </Row>
          </Row>
        </Row>
        <SuccessModalContainer
          handleClose={handleCloseSuccessModal}
          showModal={showSuccessModal}
        />
        <FailModalContainer
          handleClose={handleCloseFailModal}
          showModal={showFailModal}
        />
      </Container>
    )
  );
}
