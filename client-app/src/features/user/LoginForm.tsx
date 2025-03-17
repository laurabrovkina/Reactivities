import React, { useState } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Header, Segment, Divider, Icon, Grid, Message } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';
import { UserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired, composeValidators } from 'revalidate';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Email validation with detailed error message
const validateEmail = (value: string) => {
  if (!value) return undefined; // Let isRequired handle empty cases
  
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address (e.g., name@example.com)';
  }
  return undefined;
};

// Password validation with minimum length
const validatePassword = (value: string) => {
  if (!value) return undefined; // Let isRequired handle empty cases
  
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
};

const validate = combineValidators({
  email: composeValidators(
    isRequired('Email'),
    validateEmail
  )(),
  password: composeValidators(
    isRequired('Password'),
    validatePassword
  )()
});

const LoginForm = observer(() => {
  const { userStore } = useStore();
  const { login, isLoading } = userStore;
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect path from location state or default to '/activities'
  const from = location.state?.from?.pathname || '/activities';

  const handleSubmit = async (values: UserFormValues) => {
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      return {
        [FORM_ERROR]: error instanceof Error ? error.message : 'An error occurred during login'
      };
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid textAlign="center" style={{ height: '70vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Icon name="user" /> Log in to your account
        </Header>
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
              dirtySinceLastSubmit,
              values
            }) => (
              <Form onSubmit={handleSubmit} size="large" error={!!submitError && !dirtySinceLastSubmit}>
                <Field
                  name="email"
                  component={TextInput}
                  placeholder="Email address"
                  icon="mail"
                  iconPosition="left"
                  autoComplete="email"
                  autoFocus
                />
                <Field
                  name="password"
                  component={TextInput}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  icon={
                    <Icon
                      name={showPassword ? "eye slash" : "eye"}
                      link
                      onClick={toggleShowPassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    />
                  }
                  iconPosition="left"
                  autoComplete="current-password"
                />
                
                {submitError && !dirtySinceLastSubmit && (
                  <ErrorMessage
                    error={submitError}
                    text="Invalid email or password"
                  />
                )}
                
                <Button
                  fluid
                  size="large"
                  color="teal"
                  disabled={(invalid && !dirtySinceLastSubmit) || pristine || isLoading}
                  loading={submitting || isLoading}
                  content="Login"
                  type="submit"
                  aria-label="Log in to your account"
                />
                
                <Divider horizontal>Or</Divider>
                
                <Button
                  as={Link}
                  to="/register"
                  color="teal"
                  content="Create a new account"
                  fluid
                  basic
                  size="large"
                  icon="signup"
                  labelPosition="left"
                />
              </Form>
            )}
          />
        </Segment>
        <Message>
          <Link to="/forgot-password">Forgot your password?</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
});

export default LoginForm;
