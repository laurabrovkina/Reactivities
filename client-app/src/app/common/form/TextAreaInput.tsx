import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, Label } from 'semantic-ui-react';

interface Props extends FieldRenderProps<string> {
    rows: number;
    placeholder: string;
    name: string;
    label?: string;
    disabled?: boolean;
}

const TextAreaInput: React.FC<Props> = ({
    input,
    rows,
    placeholder,
    name,
    label,
    meta: { touched, error },
    disabled
}) => {
    return (
        <Form.Field error={touched && !!error}>
            {label && <label>{label}</label>}
            <Form.TextArea
                {...input}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
            />
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    );
};

export default TextAreaInput; 