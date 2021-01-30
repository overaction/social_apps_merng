import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Feed, Icon } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import DeleteAlarmBtn from './DeleteAlarmBtn';

const Alert = () => {
    const [visible, setVisible] = useState(false);
    const [alarms, setAlarms] = useState({});
    const {user} = useContext(AuthContext);
    const {loading,err,data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: user.username
        }
    });
    const [deleteAllAlarms] = useMutation(DELETE_ALL_ALARMS, {
        update(cache,result) {
            setAlarms([]);
        }
    })
    useEffect(() => {
        if(data) {
            setAlarms(data.getUser.alarms.slice(0).reverse());
            console.log(data);
            console.log(alarms)
        }
    },[data]);

    return (
        <>
            <Button
                as="div"
                basic
                floated="right"
                onClick={() => setVisible(prev => !prev)}
                className="alarmBtn"
                
            >
                    <Icon.Group>
                        <Icon
                            name="alarm"
                            color="blue"
                            size="large"
                            style={{ margin: 0, marginTop: 4 }}
                            
                        />
                        {alarms.length > 0 && <Icon corner name="circle" color="red" size="small">{alarms.length}</Icon>}
                    </Icon.Group>
            </Button>
            {visible && (
                <Card className="alarm-Container">
                    {/*알람 전체삭제*/}
                    <Card.Content style={{display:'flex', justifyContent:'space-between'}}>
                        <Card.Header>Recent Activity</Card.Header>
                        {alarms.length > 0 && (
                            <Button className="clearAllBtn"
                            floated="right"
                            color="blue" size="medium" onClick={deleteAllAlarms}>
                            <Icon name="check" color="teal" size="big" style={{marginLeft:15}}/>
                        </Button>
                        )}
                    </Card.Content>
                    <Card.Content>
                        {alarms.length ? (
                            alarms.map(alarm => (
                                <div style={{display:"flex", justifyContent: "space-between"}}>
                                    <Feed key={alarm.createdAt} style={{marginRight: 30}}>
                                        <Feed.Event>
                                            <Feed.Label image="/images/avatar/small/jenny.jpg" />
                                            <Feed.Content>
                                                <Feed.Date content={moment(alarm.createdAt).fromNow()} />
                                                <Feed.Summary>
                                                    {/*TODO: 눌렀을 때 해당 게시글로 이동 */}
                                                    <Link to={`/posts/${alarm.postId}`}>
                                                    {alarm.username}님이 {alarm.body}.
                                                    </Link>
                                                </Feed.Summary>
                                            </Feed.Content>
                                        </Feed.Event>
                                    </Feed>
                                    <DeleteAlarmBtn alarmId={alarm.id}/>
                                </div>
                            ))
                        ) : 'no alarm'}
                    </Card.Content>
                </Card>
            )}
        </>
    );
}

const FETCH_USER_QUERY = gql`
    query($username: String!) {
        getUser(username: $username) {
            id email username
            alarms {
                id
                username
                createdAt
                body
                postId
            }
        }
    }
`

const DELETE_ALL_ALARMS = gql`
    mutation{
        deleteAllAlarms {
            id email username
            alarms {
                id
                username
                createdAt
                body
            }
        }
    }
`;

export default Alert
