import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import * as yup from "yup";
import {
  postResetPassword,
  postRestoreLoginByEmail,
} from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FailModalContainer } from "../../common/Modals/FailModal/FailModalContainer";
import { SuccessModalContainer } from "../../common/Modals/SuccessModal/SuccessModalContainer";
export function ResetPassword() {
  const { token } = useParams();
  const [newAccessKeyMessage, setNewAccessKeyMessage] = useState("");
  useEffect(() => {
    const resetPasswordFetch = async () => {
      const resetPasswordRequest = await postResetPassword({ token: token });
      if (resetPasswordRequest.error) {
        setNewAccessKeyMessage(
          "ERROR: " + resetPasswordRequest.response.data.message
        );
      } else {
        setNewAccessKeyMessage(resetPasswordRequest.message);
      }
    };
    console.log("Token: ", token);
    resetPasswordFetch();
  }, [token]);

  return (
    <>
      <Row className="overflow-hidden m-0 link-light bg-cherry">
        <Col
          sm={12}
          md={4}
          className="d-flex align-items-center my-0 mx-auto min-vh-100"
        >
          <Container>
              <h1 className="fw-bold">PMX_RESP</h1>
              <h5>{newAccessKeyMessage}</h5>
            
          </Container>
        </Col>
      </Row>
    </>
  );
}
