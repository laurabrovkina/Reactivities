import React from "react";
import { AxiosResponse } from "axios";
import { Message } from "semantic-ui-react";

interface ServerError {
  statusText: string;
  data: {
    errors?: Record<string, string[]>;
    message?: string;
  };
}

interface Props {
  error: AxiosResponse | ServerError | any;
  text?: string;
}

export const ErrorMessage: React.FC<Props> = ({ error, text }) => {
  // Function to safely get error messages
  const getErrorMessages = () => {
    // Handle case where error is an AxiosResponse or similar object
    if (error.data && error.data.errors && typeof error.data.errors === 'object') {
      return Object.values(error.data.errors)
        .flat()
        .filter((err): err is string => typeof err === 'string');
    }
    
    // Handle case where error might be a string or other format
    if (typeof error === 'string') {
      return [error];
    }

    // Handle case where error might have a message property
    if (error.message && typeof error.message === 'string') {
      return [error.message];
    }

    return [];
  };

  const errorMessages = getErrorMessages();

  return (
    <Message error>
      <Message.Header>
        {error.statusText || 'Error'}
      </Message.Header>
      {errorMessages.length > 0 && (
        <Message.List>
          {errorMessages.map((err, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};
