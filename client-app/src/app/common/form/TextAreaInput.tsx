import React, { useState, useEffect, useRef } from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Icon, Popup } from "semantic-ui-react";

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
  autoGrow?: boolean;
  showCharCount?: boolean;
  helpText?: string;
  validateOnChange?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
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
  autoGrow = false,
  showCharCount = false,
  helpText,
  validateOnChange = false,
  meta: { touched, error, active, dirty, dirtySinceLastSubmit },
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(input.value?.length || 0);
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine if we should show an error
  const showError = touched && !!error;
  
  // Auto-grow functionality
  useEffect(() => {
    if (autoGrow && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input.value, autoGrow]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    input.onChange(value);
    setCharCount(value.length);
    
    // If autoGrow is enabled, adjust the height
    if (autoGrow && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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
  
  // Character count color based on length
  const getCharCountColor = () => {
    if (!maxLength) return undefined;
    
    const percentage = charCount / maxLength;
    if (percentage >= 0.9) return 'red';
    if (percentage >= 0.7) return 'orange';
    return undefined;
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
      
      <div className="textarea-container" style={{ position: 'relative' }}>
        <textarea 
          ref={textareaRef}
          id={input.name}
          name={input.name}
          value={input.value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          aria-required={required}
          aria-invalid={showError ? true : undefined}
          aria-describedby={showError ? `${input.name}-error` : undefined}
          style={{ 
            width: fluid ? '100%' : undefined,
            resize: autoGrow ? 'none' : resize,
            paddingBottom: showCharCount && maxLength ? '1.5em' : undefined
          }}
        />
        
        {showCharCount && maxLength && (
          <div 
            style={{ 
              position: 'absolute',
              bottom: '0.3em',
              right: '0.5em',
              fontSize: '0.8em',
              color: getCharCountColor()
            }}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
      
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

export default TextAreaInput; 