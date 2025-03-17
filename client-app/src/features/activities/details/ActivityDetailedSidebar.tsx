import React from 'react';
import { Segment, List, Item, Label, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Activity } from '../../../app/models/activity';
import { Profile } from '../../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface Props {
    activity: Activity;
}

interface AttendeeItemProps {
    attendee: Profile;
    isHost: boolean;
}

const AttendeeItem: React.FC<AttendeeItemProps> = observer(({ attendee, isHost }) => (
    <Item style={{ position: 'relative' }} key={attendee.username}>
        {isHost && (
            <Label
                style={{ position: 'absolute' }}
                color='orange'
                ribbon='right'
                aria-label="Host indicator"
            >
                Host
            </Label>
        )}
        <Image 
            size='tiny' 
            src={attendee.image || '/assets/user.png'} 
            alt={`${attendee.displayName}'s avatar`}
            style={{ marginRight: '1em' }}
        />
        <Item.Content verticalAlign='middle'>
            <Item.Header as='h3'>
                <Link to={`/profiles/${attendee.username}`}>
                    {attendee.displayName}
                </Link>
            </Item.Header>
            <Item.Extra>
                <div>
                    {attendee.following && (
                        <Popup
                            content='You are following this user'
                            trigger={
                                <Label basic color='orange'>Following</Label>
                            }
                            position='top center'
                        />
                    )}
                    {attendee.followersCount > 0 && (
                        <Label basic color='teal'>
                            {attendee.followersCount} {attendee.followersCount === 1 ? 'Follower' : 'Followers'}
                        </Label>
                    )}
                </div>
            </Item.Extra>
        </Item.Content>
    </Item>
));

const ActivityDetailedSidebar: React.FC<Props> = observer(({ activity }) => {
    if (!activity) return null;

    const attendees = activity.attendees || [];
    const host = activity.host;
    const totalAttendees = attendees.length + (host ? 1 : 0);

    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {totalAttendees} {totalAttendees === 1 ? 'Person' : 'People'} Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {host && (
                        <AttendeeItem 
                            attendee={host} 
                            isHost={true}
                        />
                    )}
                    {attendees
                        .filter(attendee => attendee.username !== host?.username)
                        .map(attendee => (
                            <AttendeeItem
                                key={attendee.username}
                                attendee={attendee}
                                isHost={false}
                            />
                        ))
                    }
                </List>
            </Segment>
        </>
    );
});

export default ActivityDetailedSidebar;
