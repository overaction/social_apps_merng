import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

const DeleteAlarmBtn = ({alarmId}) => {
    const history = useHistory();
    const [deleteAlarm] = useMutation(DELETE_ALARM, {
        update(cache,result) {
            console.log(alarmId)
        },
        onError(err) {
            console.log(err.graphQLErrors[0].message);
            history.go(0);
        },
        variables: {
            alarmId
        }
    })
    return (
        <Button className="deleteAlarm" color="blue" size="mini" onClick={deleteAlarm}>
            <Icon name="delete" />
        </Button>
    );
}

const DELETE_ALARM = gql`
    mutation($alarmId: ID!) {
        deleteAlarm(alarmId: $alarmId) {
            id
            email
            username
            createdAt
            alarms {
                id
                username
                createdAt
                body
            }
        }
    }
`;

export default DeleteAlarmBtn;
