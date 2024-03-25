import React, { useEffect, useState } from 'react'


export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }) {
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);
  
      return () => clearTimeout(timeout);
    }, [value]);
  
    return React.createElement("input", {
      ...props,
      value: value,
      onChange: (e) => setValue(e.target.value),
    });
  }