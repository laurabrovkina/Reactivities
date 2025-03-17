import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps
  extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps {
  placeholder: string;
  date?: boolean;
  time?: boolean;
  id?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  input,
  width,
  placeholder,
  date = false,
  time = false,
  id,
  meta: { touched, error },
  ...rest
}) => {
  // Filter out semantic-ui specific props that don't belong in DatePicker
  const { as, content, control, children, label, ...datePickerProps } = rest;

  return (
    <Form.Field error={touched && !!error} width={width}>
      <DatePicker
        placeholderText={placeholder}
        selected={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        showTimeSelect={time}
        showTimeSelectOnly={time && !date}
        timeIntervals={15}
        timeCaption="Time"
        dateFormat={date && time ? "MMMM d, yyyy h:mm aa" : date ? "MMMM d, yyyy" : "h:mm aa"}
        className="form-control"
        id={id}
        {...datePickerProps}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
