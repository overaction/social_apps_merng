import { gql, useMutation } from '@apollo/react-hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

const LikeButton = ({post:{id,likeCount,likes}}) => {
    const {user} = useContext(AuthContext);
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        if(user && likes.find(like => like.username === user.username))
            setLiked(true);
        else setLiked(false);
    },[user,likes]);

    const [likePost, {loading,error}] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id}
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
