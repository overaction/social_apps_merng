import { gql, useMutation } from '@apollo/react-hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { ALARM_MUTATION } from '../utils/graphql';

const LikeButton = ({post:{username,id,likeCount,likes}}) => {
    const {user} = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    const history = useHistory();
    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)) {
            setLiked(true);
        }
        else setLiked(false);
    },[user,likes]);

    const [createAlarm] = useMutation(ALARM_MUTATION, {
        update(cache,result) {
            console.log('alarm created');
            console.log(result);
        },
        variables: {
            username,
            body: '좋아요 표시를 했습니다',
            postId: id
        }
    })

    const [likePost, {loading,error}] = useMutation(LIKE_POST_MUTATION, {
        update(cache, result) {
            if(liked === false) createAlarm();
        },
        variables: {postId: id},
        onError() {
            history.push('/');
            window.location.reload();
        }
    });

    return (
        <Button as="div" labelPosition="right" onClick={likePost}>
            {user ? (
                liked ? (
                    <Button color="teal">
                        <Icon name="heart" />
                    </Button>
                ) : (
                    <Button color="teal" basic>
                        <Icon name="heart" />
                    </Button>
                )
            ) : (
                <Button as={Link} to={`/login`} color="teal" basic>
                    <Icon name="heart" />
                </Button>
            )}
            <Label basic color="teal" pointing="left">
                {likeCount}
            </Label>
        </Button>
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id createdAt username
            }
            likeCount
        }
    }
`;

export default LikeButton
