import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { UsersSearchTableContainer } from "./UsersSearchTable/UsersSearchTableContainer";
import { ResponsivesTableContainer } from "./ResponsivesTable/ResponsivesTableContainer";
import { ServersTableContainer } from "./ServersTable/ServersTableContainer";
import {
  getAllResponsive,
  getAllServers,
  getAllUsersServers,
} from "../../../services/api";
import { exportToExcelGeneralPanel } from "../../../func/func";

export function UserServers() {
  const [usersData, setUsersData] = useState(null);
  const [responsiveData, setResponsiveData] = useState(null);
  const [usersOriginalData, setUsersOriginalData] = useState(null);
  const [responsiveOriginalData, setResponsiveOriginalData] = useState(null);
  const [serverF3Data, setServerF3Data] = useState(null);
  const [serverF4Data, setServerF4Data] = useState(null);
  const [serverData, setServerData] = useState(null);
  const [serverOriginalData, setServerOriginalData] = useState(null);
  const [rowSelectionUsers, setRowSelectionUsers] = useState({});
  const [rowSelectionResponsive, setRowSelectionResponsive] = useState({});
  const [rowSelectionServers, setRowSelectionServers] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getAllUsersServers();
      setUsersOriginalData(data);
      setUsersData(data);
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    const fetchServerData = async () => {
      const data = await getAllServers();
      setServerOriginalData(data);
      setServerData(data);
    };
    fetchServerData();
  }, []);
  useEffect(() => {
    const fetchResponsiveData = async () => {
      const data = await getAllResponsive();
      setResponsiveOriginalData(data);
      setResponsiveData(data);
    };
    fetchResponsiveData();
  }, []);
  useEffect(() => {
    if (responsiveOriginalData && Object.keys(rowSelectionUsers).length > 0) {
      const filteredData = responsiveOriginalData.filter((responsiveData) =>
        Object.keys(rowSelectionUsers).includes(
          responsiveData.user_servers_id_fk.toString()
        )
      );
      setResponsiveData(filteredData);
    } else {
      setResponsiveData(responsiveOriginalData);
    }
  }, [rowSelectionUsers, responsiveOriginalData]);

  useEffect(() => {
    if (!!serverData) {
      const filteredF3Data = serverData.filter((server) => !!server.hostname);
      const filteredF4Data = serverData.filter((server) => !!server.brand);
      console.log("LA F3: ", filteredF3Data);
      console.log("LA F4: ", filteredF4Data);
      setServerF3Data(filteredF3Data);
      setServerF4Data(filteredF4Data);
    }
  }, [serverData]);

  useEffect(() => {
    if (serverOriginalData && Object.keys(rowSelectionResponsive).length > 0) {
      const filteredData = serverOriginalData.filter((server) =>
        Object.keys(rowSelectionResponsive).includes(
          server.responsive_file_id_fk.toString()
        )
      );
      setServerData(filteredData);
    } else {
      setServerData(serverOriginalData);
    }
  }, [rowSelectionResponsive, serverOriginalData]);

  const userDownloadableData = useRef([]);
  const responsiveDownloadableData = useRef([]);

  const joinUserResponsiveServerData = (
    userData,
    responsiveData,
    serverData
  ) => {
    console.log("UserData: ", userData);
    console.log("ResponsiveData: ", responsiveData);
    console.log("ServerData: ", serverData);
    const joinedData = userData.flatMap((user) =>
      responsiveData
        .filter(
          (responsiveFile) =>
            user.user_server_id === responsiveFile.user_servers_id_fk
        )
        .flatMap((userResponsiveFile) =>
          serverData
            .filter(
              (server) =>
                userResponsiveFile.resp_id === server.responsive_file_id_fk
            )
            .map((server) => ({
              ...user,
              ...userResponsiveFile,
              ...server,
            }))
        )
    );

    return joinedData;
  };

  const handleGenerateXLXS = () => {
    const joinedData = joinUserResponsiveServerData(
      userDownloadableData.current,
      responsiveDownloadableData.current,
      serverData
    );
    console.log("Data unida: ", joinedData);
    exportToExcelGeneralPanel(joinedData);
  };

  return (
    <div style={{ margin: "0 auto", width: "90%" }}>
      <Row className="h-100">
        <Col
          sm={12}
          md={4}
          className=""
          style={{ minHeight: "90vh", maxHeight: "90vh" }}
        >
          <Row>
            <h4>Usuarios</h4>
          </Row>
          <Row className="overflow-y-scroll">
            {usersData && (
              <UsersSearchTableContainer
                data={usersData}
                pSetRowSelection={setRowSelectionUsers}
                pRowSelection={rowSelectionUsers}
                visibleData={userDownloadableData}
              />
            )}
          </Row>
          <Row>
            <Button onClick={() => handleGenerateXLXS()}>Generar .xlxs</Button>
          </Row>
        </Col>
        <Col sm={12} md={8} className="h-100">
          <Row className="h-50 mb-5">
            <Row>
              <h4>Responsivas</h4>
            </Row>
            <Row>
              {responsiveData && (
                <ResponsivesTableContainer
                  data={responsiveData}
                  pSetRowSelection={setRowSelectionResponsive}
                  pRowSelection={rowSelectionResponsive}
                  visibleData={responsiveDownloadableData}
                />
              )}
            </Row>
          </Row>
          <Row className="h-50">
            <Row>
              <h4>Servidores</h4>
            </Row>
            <Row>
              {serverData && (
                <>
                  {serverF3Data && (
                    <Col sm={12} md={6}>
                      <ServersTableContainer
                        pRowSelection={rowSelectionServers}
                        pSetRowSelection={setRowSelectionServers}
                        data={serverF3Data}
                        isThird
                      />
                    </Col>
                  )}
                  {serverF4Data && (
                    <Col sm={12} md={6}>
                      <ServersTableContainer
                        pRowSelection={rowSelectionServers}
                        pSetRowSelection={setRowSelectionServers}
                        data={serverF4Data}
                      />
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
