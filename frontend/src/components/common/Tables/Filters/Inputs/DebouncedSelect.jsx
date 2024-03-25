import React, { useEffect, useState } from 'react'
import ReactSelect from 'react-select';

export function DebouncedSelect({
    value: initialValue,
    onChange,
    options,
    isMulti,
    debounce = 500,
    ...props
  }) {
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (isMulti) {
          console.log("Value es isMulti: ", value);
          const selectedValues = value
            ? value.map((val) => {
                return val
                  ? typeof val.value === "number"
                    ? val.value.toString()
                    : val.value
                  : "";
              })
            : null;
          onChange(
            selectedValues
              ? selectedValues.length === 1
                ? selectedValues[0]
                : selectedValues
              : ""
          );
        } else {
          onChange(value ? value.value.toString() : "");
        }
      }, debounce);
  
      return () => clearTimeout(timeout);
    }, [value]);
  
    const handleChange = (selectedOptions) => {
      setValue(selectedOptions);
      if (isMulti) {
        if (onChange && selectedOptions) {
          console.log("Las opciones seleccionadas son: ", selectedOptions);
          const selectedValues = selectedOptions.map((selectedOption) => {
            return selectedOption
              ? typeof selectedOption.value === "number"
                ? selectedOption.value.toString()
                : selectedOption.value
              : "";
          });
          onChange(
            selectedValues.length === 1 ? selectedValues[0] : selectedValues
          );
        }
      } else {
        if (onChange && selectedOptions) {
          const selectedValue = selectedOptions
            ? typeof selectedOptions.value === "number"
              ? selectedOptions.value.toString()
              : selectedOptions.value
            : ""; // Ensure selected value is a string
          onChange(selectedValue.toLowerCase());
        }
      }
    };
  
    return (
      <ReactSelect
        {...props}
        value={value || null}
        isMulti={isMulti ? true : false}
        onChange={handleChange}
        options={options}
      />
    );
  }