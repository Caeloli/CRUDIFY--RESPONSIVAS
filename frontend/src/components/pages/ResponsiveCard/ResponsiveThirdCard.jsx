import React, { useEffect, useState } from "react";
import { ResponsiveThirdFormContainer } from "./ResponsiveThirdForm/ResponsiveThirdFormContainer";
import { ResponsiveViewerContainer } from "./ResponsiveViewer/ResponsiveViewerContainer";
import { Col, Container, Row } from "react-bootstrap";
import "./ResponsiveCard.scss";
import { useParams } from "react-router-dom";
import { getFile, getResponsive } from "../../../services/api";

export function ResponsiveThirdCard({
  isInsertMode,
  isReadMode,
  isUpdateMode,
  isRenewMode,
  isThird,
}) {
  const [responsiveData, setResponsiveData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [renewFile, setRenewFile] = useState(null);
  const { fileID } = useParams();

  useEffect(() => {
    const fetchResponsiveData = async () => {
      try {
        const result = await getResponsive(fileID);
        console.log("Result: ", result);
        result.before_responsive_id = result.before_resp_id_fk;
        result.after_responsive_id = result.after_resp_id_fk;
        if (isRenewMode) {
          result.start_date = new Date().toISOString().substring(0, 10);
          result.end_date = new Date(
            new Date(result.start_date).setFullYear(
              new Date(result.start_date).getFullYear() + 1
            )
          )
            .toISOString()
            .split("T")[0];
          result.before_responsive_id = result.resp_id;
        } else {
          result.end_date = new Date(result.end_date)
            .toISOString()
            .substring(0, 10);
          result.start_date = new Date(result.start_date)
            .toISOString()
            .substring(0, 10);
        }
        const resultFile = await getFile(fileID);
        const receivedFile = new File([resultFile], "filename.pdf", {
          type: "application/pdf",
        });
        const updatedObject = {
          ...result,
          user_name: result.user_server_id,
          servers: result.servers.map((server) => ({
            ...server,
            windows_server: server.server_name,
          })),
        };

        setResponsiveData({ ...updatedObject, file: receivedFile });
        //setPreviewFile(receivedFile);
        if (isRenewMode) setRenewFile(receivedFile);
        else {
          setPreviewFile(receivedFile);
        }
      } catch (error) {
        console.error("Error fetching responsive data:", error);
      }
    };

    const fetchResponsiveFile = async () => {
      // Implement file fetching logic here
      try {
        const result = await getFile(fileID);
        const receivedFile = new File([result], "filename.pdf", {
          type: "application/pdf",
        }); // Adjust filename and type accordingly
        setResponsiveData((prevData) => ({
          ...prevData,
          file: receivedFile,
        }));
        setPreviewFile(receivedFile);
      } catch (error) {
        console.error("Error fetching responsive data:", error);
      }
    };

    if (isReadMode || isUpdateMode || isRenewMode) {
      fetchResponsiveData();
      //fetchResponsiveFile();
      // If you also need to fetch files, call fetchResponsiveFile() here
    }
  }, [fileID, isReadMode, isUpdateMode, isRenewMode]);

  return (
    <Container>
      <Row>
        <Col md="6">
          {isInsertMode && (
            <ResponsiveThirdFormContainer
              isInsertMode={isInsertMode}
              isReadMode={isReadMode}
              isUpdateMode={isUpdateMode}
              isRenewMode={isRenewMode}
              setPreviewFile={setPreviewFile}
              isThird={isThird}
            />
          )}
          {(isReadMode || isUpdateMode || isRenewMode) && responsiveData && (
            <ResponsiveThirdFormContainer
              isInsertMode={isInsertMode}
              isReadMode={isReadMode}
              isUpdateMode={isUpdateMode}
              isRenewMode={isRenewMode}
              setPreviewFile={setPreviewFile}
              responsiveData={responsiveData}
              isThird={isThird}
            />
          )}
        </Col>
        <Col md="6" className="position-relative d-flex">
          {isRenewMode ? (
            <>
              <Col
                md={"12"}
                className="d-flex flex-column flex-grow-1 justify-space-between"
              >
                <div className="d-flex flex-column flex-grow-1 mb-3">
                  <h5>Responsiva por Renovar</h5>
                  <ResponsiveViewerContainer
                    file={renewFile}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
                <div className="d-flex flex-column flex-grow-1 mb-3">
                  <h5>Responsiva Nueva</h5>
                  <ResponsiveViewerContainer
                    file={previewFile}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
              </Col>
            </>
          ) : (
            <Col md={"12"} className="d-flex">
              <ResponsiveViewerContainer
                file={previewFile}
                width={"100%"}
                height={"100%"}
              />
            </Col>
          )}
        </Col>
      </Row>
    </Container>
  );
}
