import React, { useMemo } from 'react';
import { Item, Button, Segment, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import { Profile } from '../../../app/models/profile';
import { format } from 'date-fns';

interface Props {
    activity: Activity;
}

const AttendeePreview: React.FC<{ attendee: Profile }> = ({ attendee }) => (
    <Item style={{ display: 'inline-block', marginRight: '0.5em' }}>
        <Image 
            avatar 
            size="mini" 
            src={attendee.image || '/assets/user.png'} 
            as={Link}
            to={`/profile/${attendee.username}`}
        />
    </Item>
);

export const ActivityListItem: React.FC<Props> = ({ activity }) => {
    const {
        id,
        title,
        description,
        date,
        venue,
        city,
        category,
        host,
        isHost = false,
        isGoing = false,
        attendees = []
    } = activity;

    // Memoize the formatted date to prevent unnecessary recalculations
    const formattedDate = useMemo(() => {
        return {
            time: format(date, 'h:mm a'),
            day: format(date, 'eeee'),
            date: format(date, 'do MMM')
        };
    }, [date]);

    // Get the first 3 attendees for the preview
    const previewAttendees = attendees.slice(0, 3);
    const remainingAttendees = attendees.length - 3;

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image 
                            size="tiny" 
                            circular 
                            src={host?.image || '/assets/user.png'} 
                        />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${id}`}>
                                {title}
                            </Item.Header>
                            <Item.Description>
                                Hosted by{' '}
                                <Link to={`/profile/${host?.username || ''}`}>
                                    {host?.displayName || 'Unknown'}
                                </Link>
                                {isHost && (
                                    <Label 
                                        basic 
                                        color='orange' 
                                        style={{ marginLeft: '0.5em' }}
                                    >
                                        You are hosting this activity
                                    </Label>
                                )}
                                {isGoing && !isHost && (
                                    <Label 
                                        basic 
                                        color='green' 
                                        style={{ marginLeft: '0.5em' }}
                                    >
                                        You are going to this activity
                                    </Label>
                                )}
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {formattedDate.time}
                    <Icon name="calendar" style={{ marginLeft: '0.5em' }} />
                    {formattedDate.day}, {formattedDate.date}
                </span>
                <span style={{ marginLeft: '1em' }}>
                    <Icon name="marker" /> {venue}, {city}
                </span>
            </Segment>
            <Segment secondary>
                <span>
                    <Icon name="users" /> {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going
                </span>
                {previewAttendees.length > 0 && (
                    <Item.Group style={{ marginTop: '0.5em' }}>
                        {previewAttendees.map(attendee => (
                            <AttendeePreview 
                                key={attendee.username} 
                                attendee={attendee} 
                            />
                        ))}
                        {remainingAttendees > 0 && (
                            <Label 
                                circular 
                                basic 
                                color='grey'
                                style={{ marginLeft: '0.5em' }}
                            >
                                +{remainingAttendees} more
                            </Label>
                        )}
                    </Item.Group>
                )}
            </Segment>
            <Segment clearing>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon name="tag" style={{ marginRight: '0.5em' }} />
                    {category}
                    <span style={{ marginLeft: 'auto' }}>
                        <Button
                            as={Link}
                            to={`/activities/${id}`}
                            floated="right"
                            content="View"
                            color="blue"
                        />
                    </span>
                </span>
                <p style={{ marginTop: '0.5em', color: 'rgba(0,0,0,.6)' }}>
                    {description}
                </p>
            </Segment>
        </Segment.Group>
    );
};
