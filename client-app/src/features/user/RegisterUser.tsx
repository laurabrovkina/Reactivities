import React from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Header, Segment, Divider } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';
import { UserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired, composeValidators } from 'revalidate';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const isValidEmail = (value: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) ? undefined : 'Invalid email address';
};

const validate = combineValidators({
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  email: composeValidators(
    isRequired('Email'),
    (value: string) => isValidEmail(value)
  )(),
  password: isRequired('Password')
});

const RegisterForm = observer(() => {
  const { userStore } = useStore();
  const { register, isLoading } = userStore;

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await register(values);
    } catch (error) {
      return {
        [FORM_ERROR]: error instanceof Error ? error.message : 'An error occurred during registration'
      };
    }
  };

  return (
    <Segment>
      <FinalForm
        onSubmit={handleSubmit}
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Sign up to Reactivities"
              color="teal"
              textAlign="center"
            />
            <Field 
              name="username" 
              component={TextInput} 
              placeholder="Username"
              autoComplete="username" 
            />
            <Field 
              name="displayName" 
              component={TextInput} 
              placeholder="Display Name"
            />
            <Field 
              name="email" 
              component={TextInput} 
              placeholder="Email"
              autoComplete="email"
            />
            <Field
              name="password"
              component={TextInput}
              placeholder="Password"
              type="password"
              autoComplete="new-password"
            />
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage
                error={submitError}
                text="Registration error"
              />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine || isLoading}
              loading={submitting || isLoading}
              color="teal"
              content="Register"
              fluid
              size="large"
            />
            <Divider horizontal>Or</Divider>
            <Button
              as={Link}
              to="/login"
              color="teal"
              content="Already have an account? Login"
              fluid
              basic
              size="large"
            />
          </Form>
        )}
      />
    </Segment>
  );
});

export default RegisterForm;