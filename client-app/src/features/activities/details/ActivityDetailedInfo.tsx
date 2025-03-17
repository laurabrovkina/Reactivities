import React, { useMemo } from 'react';
import { Segment, Grid, Icon, Popup } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

interface Props {
    activity: Activity;
}

const ActivityDetailedInfo: React.FC<Props> = observer(({ activity }) => {
    const formattedDateTime = useMemo(() => ({
        date: format(activity.date, 'eeee do MMMM'),
        time: format(activity.date, 'h:mm a')
    }), [activity.date]);

    const location = useMemo(() => ({
        venue: activity.venue,
        city: activity.city
    }), [activity.venue, activity.city]);

    return (
        <Segment.Group>
            <Segment attached="top">
                <Grid>
                    <Grid.Column width={1}>
                        <Popup
                            content="Activity Description"
                            trigger={
                                <Icon 
                                    size="large" 
                                    color="teal" 
                                    name="info" 
                                    aria-label="Description"
                                />
                            }
                        />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{activity.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Popup
                            content="Activity Date and Time"
                            trigger={
                                <Icon 
                                    name="calendar" 
                                    size="large" 
                                    color="teal" 
                                    aria-label="Date and Time"
                                />
                            }
                        />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {formattedDateTime.date} at {formattedDateTime.time}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Popup
                            content="Activity Location"
                            trigger={
                                <Icon 
                                    name="marker" 
                                    size="large" 
                                    color="teal" 
                                    aria-label="Location"
                                />
                            }
                        />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {location.venue}, {location.city}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    );
});

export default ActivityDetailedInfo;
