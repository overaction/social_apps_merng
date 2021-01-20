import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const DeleteButton = ({postId, callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(cache,result) {
            setConfirmOpen(false);
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY
            });
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {getPosts : data.getPosts.filter(post => post.id !== postId)}
            })
            if(callback) callback();
            
        },
        variables: {
            postId: postId
        }
    })
    return (
        <>
            <Button
                as="div"
                color="red"
                floated="right"
                onClick={() => setConfirmOpen(true)}
            >
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

export default DeleteButton
