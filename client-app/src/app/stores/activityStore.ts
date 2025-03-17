import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { Activity } from '../models/activity';
import agent from '../api/agent';
import { router } from '../router/Routes';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { BaseStore } from './baseStore';

export class ActivityStore extends BaseStore {
    @observable.shallow private activityRegistry = new Map<string, Activity>();
    @observable activity: Activity | null = null;
    @observable target = '';

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    // Computed properties
    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    @computed get isLoading() {
        return this.getLoadingState('general');
    }

    @computed get isSubmitting() {
        return this.getLoadingState('submit');
    }

    // Private methods
    private groupActivitiesByDate(activities: Activity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.toISOString().split('T')[0];
                activities[date] = activities[date] 
                    ? [...activities[date], activity] 
                    : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }

    private getActivity = (id: string): Activity | undefined => {
        return this.activityRegistry.get(id);
    }

    // Public actions
    @action loadActivities = async () => {
        try {
            const activities = await this.executeAction(
                'general',
                () => agent.Activities.list(),
                'loading activities'
            );
            
            runInAction(() => {
                if (activities) {
                    activities.forEach(activity => {
                        this.setActivity(activity);
                    });
                }
            });
        } catch (error) {
            toast.error('Problem loading activities');
            throw error;
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        }

        try {
            activity = await this.executeAction(
                'general',
                () => agent.Activities.details(id),
                'loading activity'
            );
            
            runInAction(() => {
                if (activity) {
                    this.setActivity(activity);
                    this.activity = activity;
                }
            });
            return activity;
        } catch (error) {
            toast.error('Problem loading activity');
            throw error;
        }
    };

    @action clearActivity = () => {
        this.activity = null;
    };

    @action createActivity = async (activity: Activity) => {
        try {
            await this.executeAction(
                'submit',
                () => agent.Activities.create(activity),
                'creating activity'
            );
            
            runInAction(() => {
                this.setActivity(activity);
            });
            router.navigate(`/activities/${activity.id}`);
        } catch (error) {
            toast.error('Problem creating activity');
            throw error;
        }
    };

    @action editActivity = async (activity: Activity) => {
        try {
            await this.executeAction(
                'submit',
                () => agent.Activities.update(activity),
                'updating activity'
            );
            
            runInAction(() => {
                this.setActivity(activity);
                this.activity = activity;
            });
            router.navigate(`/activities/${activity.id}`);
        } catch (error) {
            toast.error('Problem updating activity');
            throw error;
        }
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.target = event.currentTarget.name;
        try {
            await this.executeAction(
                'submit',
                () => agent.Activities.delete(id),
                'deleting activity'
            );
            
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.target = '';
            });
        } catch (error) {
            toast.error('Problem deleting activity');
            throw error;
        }
    };

    @action attend = async (id: string) => {
        const activity = this.getActivity(id);
        if (!activity) return;

        try {
            await this.executeAction(
                'submit',
                () => agent.Activities.attend(id),
                'attending activity'
            );
            
            runInAction(() => {
                if (activity) {
                    activity.isGoing = true;
                    this.setActivity(activity);
                }
            });
        } catch (error) {
            toast.error('Problem joining activity');
            throw error;
        }
    };

    @action cancelAttendance = async (id: string) => {
        const activity = this.getActivity(id);
        if (!activity) return;

        try {
            await this.executeAction(
                'submit',
                () => agent.Activities.attend(id),
                'cancelling attendance'
            );
            
            runInAction(() => {
                if (activity) {
                    activity.isGoing = false;
                    this.setActivity(activity);
                }
            });
        } catch (error) {
            toast.error('Problem cancelling attendance');
            throw error;
        }
    };

    private setActivity = (activity: Activity) => {
        activity.date = new Date(activity.date);
        this.activityRegistry.set(activity.id, activity);
    };
}
