import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

const DeleteButton = ({postId,commentId,callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
    const [deletePostOrComment] = useMutation(mutation, {
        update(cache,result) {
            setConfirmOpen(false);
            if(mutation === DELETE_POST_MUTATION) {
                const data = cache.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                cache.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {getPosts : data.getPosts.filter(post => post.id !== postId)}
                })
            }
            if(callback) callback();
            
        },
        variables: {
            postId: postId,
            commentId
        }
    })
    return (
        <>
            <MyPopup
                content={commentId ? "Delete the Comment" : "Delete the post"}
            >
                <Button
                    as="div"
                    color="red"
                    floated="right"
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton
