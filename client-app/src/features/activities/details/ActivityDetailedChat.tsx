import React, { useEffect } from 'react';
import { Segment, Header, Comment, Form, Button, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistanceToNow } from 'date-fns';
import { Form as FinalForm, Field } from 'react-final-form';
import { useStore } from '../../../app/stores/store';
import { Comment as IComment } from '../../../app/stores/commentStore';
import TextAreaInput from '../../../app/common/form/TextAreaInput';

interface Props {
    activityId: string;
}

interface CommentFormValues {
    body: string;
}

const ActivityComment: React.FC<{ comment: IComment }> = observer(({ comment }) => {
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
        <Comment>
            <Comment.Avatar src={comment.image || '/assets/user.png'} />
            <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                    {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                    <div>{timeAgo}</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
            </Comment.Content>
        </Comment>
    );
});

const ActivityDetailedChat: React.FC<Props> = observer(({ activityId }) => {
    const { commentStore } = useStore();
    const { comments, loading, submitting } = commentStore;

    useEffect(() => {
        if (activityId) {
            commentStore.loadComments(activityId);
        }
        return () => commentStore.clearComments();
    }, [commentStore, activityId]);

    const handleSubmit = async (values: CommentFormValues, form: any) => {
        try {
            await commentStore.addComment(activityId, values.body);
            form.reset();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const validate = (values: CommentFormValues) => {
        const errors: Partial<CommentFormValues> = {};
        if (!values.body?.trim()) {
            errors.body = 'Comment is required';
        }
        return errors;
    };

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {loading ? (
                        <Loader active inline='centered' content='Loading comments...' />
                    ) : comments.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'grey' }}>
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map(comment => (
                            <ActivityComment key={comment.id} comment={comment} />
                        ))
                    )}

                    <FinalForm
                        onSubmit={handleSubmit}
                        validate={validate}
                        render={({ handleSubmit, form, submitting: formSubmitting, pristine }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field
                                    name='body'
                                    component={TextAreaInput}
                                    rows={2}
                                    placeholder='Add your comment (Enter to submit, SHIFT + Enter for new line)'
                                    disabled={submitting}
                                />
                                <Button
                                    loading={submitting}
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    disabled={formSubmitting || pristine}
                                    type='submit'
                                />
                            </Form>
                        )}
                    />
                </Comment.Group>
            </Segment>
        </>
    );
});

export default ActivityDetailedChat;
