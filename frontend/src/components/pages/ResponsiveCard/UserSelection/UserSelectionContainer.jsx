import React, { useEffect, useState } from "react";
import { UserSelectionView } from "./UserSelectionView";
import { useField } from "formik";
import { getAllUsersServers } from "../../../../services/api";

export function UserSelectionContainer({
  handleChange,
  setFieldValue,
  values,
  touched,
  errors,
  isSubmit,
  isReadMode,
}) {
  const [isNewUserServer, setIsNewUserServer] = useState(false);
  const [isExistentUserServer, setIsExistentUserServer] = useState(false);
  const [usersServersDataSelect, setUsersServersDataSelect] = useState(null);
  const [usersServersData, setUsersServersData] = useState(null);
  useEffect(() => {
    const fetchUsersData = async () => {
      const data = await getAllUsersServers();
      setUsersServersData(data);
      const selectDataFormat = data.map((datum) => ({
        label: datum.user_server_username,
        value: datum.user_server_id,
      }));
      setUsersServersDataSelect(selectDataFormat);
    };
    fetchUsersData();
  }, [isSubmit]);

  useEffect(() => {
    
    if (typeof values.user_name === "number") {
      setIsNewUserServer(false);
      setIsExistentUserServer(true);
      setFieldValue("is_new_user", 2);
    } else if (values.user_name !== "") {
      setIsNewUserServer(true);
      setIsExistentUserServer(false);
      setFieldValue("is_new_user", 1);
    } else {
      setIsNewUserServer(false);
      setIsExistentUserServer(false);
      setFieldValue("is_new_user", 0);
    }
  }, []);

  const handleNewClick = () => {
    setIsNewUserServer(true);
    setFieldValue("is_new_user", 1);
  };

  const handleExistentClick = () => {
    setIsExistentUserServer(true);
    setFieldValue("is_new_user", 2);
  };

  const handleCancel = () => {
    setIsNewUserServer(false);
    setIsExistentUserServer(false);
    setFieldValue("user_name", "");
    setFieldValue("is_new_user", 0);
    setFieldValue("email", "");
    setFieldValue("email_immediately_chief", "");
    setFieldValue("immediately_chief", "");
    setFieldValue("phone", "");
    setFieldValue("email", "");
    setFieldValue("token", "");
  };

  const handleUserSelect = (id) => {

    console.log("Hay servers data: ", usersServersData);
    const userServers = usersServersData.find(
      (userServers) => userServers.user_server_id === id
    );
    setFieldValue("email", userServers.email);
    setFieldValue(
      "email_immediately_chief",
      userServers.email_immediately_chief
    );
    setFieldValue("immediately_chief", userServers.immediately_chief);
    setFieldValue("phone", userServers.phone);
    setFieldValue("email", userServers.email);
    setFieldValue("token", userServers.token);
  };

  return (
    <>
      {usersServersDataSelect && (
        <UserSelectionView
          isNewUserServer={isNewUserServer}
          isExistentUserServer={isExistentUserServer}
          handleNewClick={handleNewClick}
          handleExistentClick={handleExistentClick}
          handleCancel={handleCancel}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          values={values}
          touched={touched}
          errors={errors}
          isSubmit={isSubmit}
          isReadMode={isReadMode}
          usersServersValues={usersServersDataSelect}
          handleUserSelect={handleUserSelect}
        />
      )}
    </>
  );
}
