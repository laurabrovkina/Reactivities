import React, { useContext, Fragment, useMemo } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { ActivityListItem } from './ActivityListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';
import { Activity } from '../../../app/models/activity';
import { ActivityListEmpty } from './ActivityListEmpty';

interface ActivityGroup {
    date: string;
    activities: Activity[];
    formattedDate: string;
}

const ActivityList: React.FC = () => {
    const { activityStore } = useContext(RootStoreContext);
    const { activitiesByDate } = activityStore;

    // Memoize the activity groups to prevent unnecessary re-renders
    const activityGroups = useMemo<ActivityGroup[]>(() => {
        return (activitiesByDate as [string, Activity[]][]).map(([date, activities]) => ({
            date,
            activities,
            formattedDate: format(new Date(date), 'eeee do MMMM')
        }));
    }, [activitiesByDate]);

    if (activityGroups.length === 0) {
        return <ActivityListEmpty filterActive={false} />;
    }

    return (
        <Fragment>
            {activityGroups.map(({ date, activities, formattedDate }) => (
                <Fragment key={date}>
                    <Label 
                        size='large' 
                        color='blue' 
                        style={{ marginTop: '2rem' }}
                    >
                        {formattedDate}
                    </Label>
                    <Item.Group divided>
                        {activities.map((activity: Activity) => (
                            <ActivityListItem 
                                key={activity.id} 
                                activity={activity}
                            />
                        ))}
                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>
    );
};

export default observer(ActivityList);
