import React from 'react'
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Select, DropdownProps } from "semantic-ui-react";

interface SelectOption {
  key: string | number;
  text: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

interface SelectInputProps
  extends FieldRenderProps<string, HTMLSelectElement>,
    FormFieldProps {
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  multiple?: boolean;
  search?: boolean;
  loading?: boolean;
  clearable?: boolean;
  fluid?: boolean;
  label?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  input,
  width,
  options,
  placeholder,
  disabled = false,
  multiple = false,
  search = false,
  loading = false,
  clearable = false,
  fluid = true,
  label,
  meta: { touched, error }
}) => {
  const handleChange = (
    _: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => {
    input.onChange(data.value);
  };

  const handleBlur = () => {
    input.onBlur();
  };

  return (
    <Form.Field 
      error={touched && !!error} 
      width={width}
      disabled={disabled}
    >
      {label && <label>{label}</label>}
      <Select
        value={input.value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        options={options}
        clearable={clearable}
        search={search}
        fluid={fluid}
        multiple={multiple}
        disabled={disabled}
        loading={loading}
        aria-required={touched ? true : undefined}
        aria-invalid={touched && !!error ? true : undefined}
        aria-describedby={touched && error ? `${input.name}-error` : undefined}
      />
      {touched && error && (
        <Label 
          basic 
          color='red'
          id={`${input.name}-error`}
          pointing
        >
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
