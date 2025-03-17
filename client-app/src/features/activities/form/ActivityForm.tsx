import { useEffect, useState } from 'react';
import { Segment, Form, Button, Grid, Message } from 'semantic-ui-react';
import { Activity, ActivityForm as ActivityFormModel, ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import { TextArea } from '../../../app/common/form/TextArea';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category as categoryOptions } from '../../../app/common/options/categoryOptions';
import { DateInput } from '../../../app/common/form/DateInput';
import { combineValidators, isRequired, hasLengthGreaterThan, composeValidators } from 'revalidate';
import { useStore } from '../../../app/stores/store';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';

interface FormRenderProps {
  handleSubmit: () => void;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
}

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
});

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    editActivity,
    isSubmitting,
    loadActivity,
    isLoading,
    clearActivity
  } = activityStore;

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activityForm, setActivityForm] = useState(() => ActivityFormModel.createEmpty());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExistingActivity = async () => {
      if (id) {
        try {
          const activity = await loadActivity(id);
          if (activity) {
            setActivityForm(ActivityFormModel.fromActivity(activity));
          } else {
            navigate('/notfound');
          }
        } catch (error) {
          console.error('Error loading activity:', error);
          navigate('/notfound');
        }
      }
    };

    loadExistingActivity();
    return () => clearActivity();
  }, [id, loadActivity, clearActivity, navigate]);

  const handleFinalFormSubmit = async (values: ActivityFormValues) => {
    setError(null);
    try {
      const form = ActivityFormModel.fromFormValues(values);
      const dateTime = form.combinedDateTime;
      
      if (!dateTime) {
        throw new Error('Both date and time are required');
      }

      const submitActivity: Activity = {
        ...values,
        id: id ?? uuid(),
        date: dateTime
      };

      if (id) {
        await editActivity(submitActivity);
      } else {
        await createActivity(submitActivity);
      }
      navigate(`/activities/${submitActivity.id}`);
    } catch (error) {
      console.error('Error submitting activity:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving the activity');
    }
  };

  if (isLoading) {
    return <LoadingComponent content='Loading activity...' />;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          {error && (
            <Message error>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
          )}
          <FinalForm
            validate={validate}
            initialValues={activityForm.values}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }: FormRenderProps) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  name='title'
                  placeholder='Title'
                  component={TextInput}
                />
                <Field
                  name='description'
                  rows={3}
                  placeholder='Description'
                  component={TextArea}
                />
                <Field
                  name='category'
                  options={categoryOptions}
                  placeholder='Category'
                  component={SelectInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    component={DateInput}
                    name='date'
                    date={true}
                    placeholder='Date'
                  />
                  <Field
                    component={DateInput}
                    name='time'
                    time={true}
                    placeholder='Time'
                  />
                </Form.Group>
                <Field
                  name='city'
                  placeholder='City'
                  component={TextInput}
                />
                <Field
                  name='venue'
                  placeholder='Venue'
                  component={TextInput}
                />
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting || invalid || pristine}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                />
                <Button
                  onClick={() => navigate('/activities')}
                  disabled={isSubmitting}
                  floated='right'
                  type='button'
                  content='Cancel'
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
});
