import React, { useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Icon, Input, Popup, SemanticICONS } from "semantic-ui-react";

interface TextInputProps
  extends FieldRenderProps<string, HTMLInputElement>,
    FormFieldProps {
  placeholder: string;
  type?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  label?: string;
  required?: boolean;
  fluid?: boolean;
  icon?: SemanticICONS | JSX.Element;
  iconPosition?: 'left';
  helpText?: string;
  validateOnChange?: boolean;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  input,
  width,
  type = "text",
  placeholder,
  disabled = false,
  autoFocus = false,
  maxLength,
  minLength,
  label,
  required = false,
  fluid = true,
  icon,
  iconPosition,
  helpText,
  autoComplete,
  meta: { touched, error, active, dirty }
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine if we should show an error
  const showError = touched && !!error;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    input.onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (input.onFocus) {
      input.onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    input.onBlur();
  };

  return (
    <Form.Field 
      error={showError} 
      width={width}
      disabled={disabled}
      required={required}
      className={isFocused ? 'focused' : ''}
    >
      <div className="field-header">
        {label && (
          <label htmlFor={input.name}>
            {label}
            {required && <span className="required-mark">*</span>}
          </label>
        )}
        {helpText && (
          <Popup
            trigger={<Icon name="info circle" size="small" color="grey" />}
            content={helpText}
            position="top right"
            size="tiny"
          />
        )}
      </div>
      
      <Input
        id={input.name}
        name={input.name}
        value={input.value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        required={required}
        aria-required={required}
        aria-invalid={showError ? true : undefined}
        aria-describedby={showError ? `${input.name}-error` : undefined}
        fluid={fluid}
        icon={icon}
        iconPosition={iconPosition}
        autoComplete={autoComplete}
      />
      
      {showError && (
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

export default TextInput;
