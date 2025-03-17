import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, TextAreaProps } from "semantic-ui-react";

interface TextAreaInputProps
  extends FieldRenderProps<string, HTMLTextAreaElement>,
    FormFieldProps {
  placeholder: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  label?: string;
  required?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  fluid?: boolean;
}

export const TextArea: React.FC<TextAreaInputProps> = ({
  input,
  width,
  rows = 3,
  placeholder,
  disabled = false,
  autoFocus = false,
  maxLength,
  minLength,
  label,
  required = false,
  resize = 'vertical',
  fluid = true,
  meta: { touched, error },
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    input.onChange(e.target.value);
  };

  const handleBlur = () => {
    input.onBlur();
  };

  return (
    <Form.Field 
      error={touched && !!error} 
      width={width}
      disabled={disabled}
      required={required}
    >
      {label && <label htmlFor={input.name}>{label}</label>}
      <textarea 
        id={input.name}
        name={input.name}
        value={input.value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        aria-required={required}
        aria-invalid={touched && !!error ? true : undefined}
        aria-describedby={touched && error ? `${input.name}-error` : undefined}
        style={{ 
          width: fluid ? '100%' : undefined,
          resize: resize
        }}
      />
      {touched && error && (
        <Label 
          basic 
          color="red"
          id={`${input.name}-error`}
          pointing
        >
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
