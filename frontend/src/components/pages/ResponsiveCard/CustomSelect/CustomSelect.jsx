import { ErrorMessage, useField } from "formik";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
export function CustomSelect({ ...props }) {
  const [field, meta, helpers] = useField(props);
  const [selectState, setSelectState] = useState({
    searchValue: "",
    searchSelection: "",
  });

  const { options } = props;
  const { placeholder, disabled } = props;
  const { errors } = props;
  const { handleUserSelect } = props;
  const { touched, error, value } = meta;
  const customError = !value ? "Ningún campo seleccionado" : undefined;

  return (
    <>
      <Select
        options={options}
        name={field.name}
        isSearchable
        onChange={(option) => {
          option ? helpers.setValue(option.value) : null;
          if (handleUserSelect) {
            handleUserSelect(option.value);
          }
        }}
        placeholder={placeholder}
        isDisabled={disabled}
        value={options.find((option) => option.value === value)}
        isInvalid={meta.touched && !!meta.error}
      />
      
      {meta.error && meta.touched && (
        <div className="invalid-feedback d-flex">{meta.error}</div>
      )}
      
    </>
  );
}
