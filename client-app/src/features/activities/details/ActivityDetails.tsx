import React, { useEffect } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import { useStore } from '../../../app/stores/store';
import { Activity } from '../../../app/models/activity';

const ActivityDetails: React.FC = observer(() => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { activityStore } = useStore();
    const { 
        activity, 
        loadActivity, 
        isLoading,
        clearActivity 
    } = activityStore;

    useEffect(() => {
        const fetchActivity = async () => {
            if (!id) return;
            try {
                await loadActivity(id);
            } catch (error) {
                console.error('Error loading activity:', error);
                navigate('/notfound');
            }
        };
        
        fetchActivity();
        
        return () => {
            clearActivity();
        };
    }, [loadActivity, clearActivity, id, navigate]);

    const renderContent = (activity: Activity) => (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat activityId={activity.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity} />
            </Grid.Column>
        </Grid>
    );

    if (isLoading) {
        return <LoadingComponent content='Loading activity...' />;
    }

    if (!activity) {
        return (
            <Segment>
                <h2>Activity not found</h2>
                <button onClick={() => navigate('/activities')}>
                    Back to activities
                </button>
            </Segment>
        );
    }

    return renderContent(activity);
});

export default ActivityDetails;
