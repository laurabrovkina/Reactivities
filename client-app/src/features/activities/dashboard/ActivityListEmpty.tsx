import React from 'react';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {
    filterActive?: boolean;
}

export const ActivityListEmpty: React.FC<Props> = ({ filterActive }) => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='calendar times outline' />
                {filterActive
                    ? 'No activities match your filters'
                    : 'No activities found'}
            </Header>
            <Segment.Inline>
                {!filterActive && (
                    <Button 
                        as={Link} 
                        to='/createActivity'
                        primary
                    >
                        Create Activity
                    </Button>
                )}
                {filterActive && (
                    <Button 
                        primary
                        onClick={() => window.location.reload()}
                    >
                        Clear Filters
                    </Button>
                )}
            </Segment.Inline>
        </Segment>
    );
}; 