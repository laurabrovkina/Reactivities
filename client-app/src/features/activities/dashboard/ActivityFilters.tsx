import React, { useContext } from 'react';
import { Menu, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityFilters: React.FC = () => {
    const { activityStore } = useContext(RootStoreContext);
    const { activitiesByDate } = activityStore;

    return (
        <Segment>
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item
                    name='all'
                    content='All Activities'
                    active={true}
                />
                <Menu.Item
                    name='going'
                    content="I'm going"
                />
                <Menu.Item
                    name='hosting'
                    content="I'm hosting"
                />
            </Menu>
            <Header 
                icon='calendar'
                attached
                color='teal'
                content='Select date range'
                style={{ marginTop: '10px' }}
            />
            <Menu vertical style={{ width: '100%' }}>
                <Menu.Item
                    name='all'
                    content='All dates'
                    active={true}
                />
                <Menu.Item
                    name='future'
                    content='Future Activities'
                />
                <Menu.Item
                    name='past'
                    content='Past Activities'
                />
            </Menu>
        </Segment>
    );
};

export default observer(ActivityFilters); 