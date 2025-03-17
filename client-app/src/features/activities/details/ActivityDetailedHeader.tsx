import React, { useMemo } from 'react';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

interface Props {
    activity: Activity;
}

const activityImageStyle = {
    filter: 'brightness(30%)'
} as const;

const activityImageTextStyle = {
    position: 'absolute' as const,
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
} as const;

const ActivityDetailedHeader: React.FC<Props> = observer(({ activity }) => {
    const { activityStore } = useStore();
    const { isSubmitting } = activityStore;
    
    const host = activity.host?.displayName;

    const formattedDate = useMemo(() => 
        format(activity.date, 'eeee do MMMM'), 
        [activity.date]
    );

    const categoryImage = useMemo(() => 
        `/assets/categoryImages/${activity.category.toLowerCase()}.jpg`,
        [activity.category]
    );

    const handleAttendance = async () => {
        try {
            if (activity.isGoing) {
                await activityStore.cancelAttendance(activity.id);
            } else {
                await activityStore.attend(activity.id);
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={categoryImage} fluid style={activityImageStyle} />
                <Segment basic style={activityImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{formattedDate}</p>
                                <p>
                                    Hosted by{' '}
                                    <strong>
                                        <Link to={`/profiles/${activity.host?.username}`} style={{ color: 'white' }}>
                                            {host}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button
                            as={Link}
                            to={`/manage/${activity.id}`}
                            color='orange'
                            floated='right'
                        >
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button 
                        loading={isSubmitting}
                        onClick={handleAttendance}
                    >
                        Cancel attendance
                    </Button>
                ) : (
                    <Button 
                        color='teal' 
                        loading={isSubmitting}
                        onClick={handleAttendance}
                    >
                        Join Activity
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    );
});

export default ActivityDetailedHeader;