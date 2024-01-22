import React, { useEffect, useState } from "react";
import { ResponsiveFormContainer } from "./ResponsiveForm/ResponsiveFormContainer";
import { ResponsiveViewerContainer } from "./ResponsiveViewer/ResponsiveViewerContainer";
import { Col, Container, Row } from "react-bootstrap";
import "./ResponsiveCard.scss";
import { useParams } from "react-router-dom";
import { getFile, getResponsive } from "../../../services/api";

export function ResponsiveCard({ isInsertMode, isReadMode, isUpdateMode }) {
  const [responsiveData, setResponsiveData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const { fileID } = useParams();

  useEffect(() => {
    const fetchResponsiveData = async () => {
      try {
        const result = await getResponsive(fileID);
        console.log("Resultado view: ", result);
        result.end_date = new Date(result.end_date)
          .toISOString()
          .substring(0, 10);
        result.start_date = new Date(result.start_date)
          .toISOString()
          .substring(0, 10);
        setResponsiveData(result);
      } catch (error) {
        // Handle errors
        console.error("Error fetching responsive data:", error);
      }
    };

    const fetchResponsiveFile = async () => {
      // Implement file fetching logic here
      try {
        const result = await getFile(fileID);
        setPreviewFile(new Blob([result]));
      } catch (error) {
        console.error("Error fetching responsive data:", error);
      }
    };

    if (isReadMode || isUpdateMode) {
      fetchResponsiveData();
      fetchResponsiveFile();
      // If you also need to fetch files, call fetchResponsiveFile() here
    }
  }, [fileID, isReadMode, isUpdateMode]);

  return (
    <Container>
      <Row>
        <Col md="6">
          {isInsertMode && (
            <ResponsiveFormContainer
              isInsertMode={isInsertMode}
              isReadMode={isReadMode}
              isUpdateMode={isUpdateMode}
              setPreviewFile={setPreviewFile}
            />
          )}
          {(isReadMode || isUpdateMode) && responsiveData && (
            <ResponsiveFormContainer
              isInsertMode={isInsertMode}
              isReadMode={isReadMode}
              isUpdateMode={isUpdateMode}
              setPreviewFile={setPreviewFile}
              responsiveData={responsiveData}
            />
          )}
        </Col>
        <Col md="6" className="position-relative ">
          <ResponsiveViewerContainer file={previewFile} />
        </Col>
      </Row>
    </Container>
  );
}
