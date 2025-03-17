import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {observer} from 'mobx-react-lite';
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import ActivityFilters from './ActivityFilters';

const ActivityDashboard: React.FC = () => {
  const { activityStore } = useContext(RootStoreContext);
  const { loadActivities, isLoading, activitiesByDate } = activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (isLoading)
    return <LoadingComponent content="Loading activities..." />;
    
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
