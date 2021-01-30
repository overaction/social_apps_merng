import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, Grid, Image, Icon, Label, Form } from 'semantic-ui-react';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import moment from 'moment';
import MyPopup from '../utils/MyPopup';
import { ALARM_MUTATION } from '../utils/graphql';

const SinglePost = () => {
    const [post, setPost] = useState(null);
    const {user} = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');
    const param = useParams();
    const postId = param.postId;
    const {data} = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId:postId
        },
    });
    useEffect(() => {
        if(data) {
            setPost(data.getPost)
        }
    },[data])
    const history = useHistory();
    const deletePostCallback = () => {
        history.push({
            pathname: '/'
        })
    }

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(cache, result) {
            commentInputRef.current.blur();
            setComment('');
            createAlarm();
        },
        variables: {
            postId,
            body: comment
        },
        onError(err) {
            console.log(err.graphQLErrors[0].message);
            history.push('/');
            window.location.reload();
        },
    });

    const [createAlarm] = useMutation(ALARM_MUTATION, {
        update(cache,result) {
            console.log('alarm created');
            console.log(result);
        },
        variables: {
            username: post ? post.username : 'load',
            body: '댓글을 남겼습니다',
            postId
        }
    })

    let postMarkup;
    if(!post) {
        postMarkup = <p>Loading Post...</p>
    } else {
        const {id, body, createdAt, username, comments,likes, likeCount, commentCount} = post;
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>
                                    {moment(createdAt).fromNow()}
                                </Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton post={{ username, id, likeCount, likes }} />
                                <MyPopup content="Comment on Post">
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                        onClick={() =>
                                            console.log("Comment on post")
                                        }
                                    >
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label
                                            basic
                                            color="blue"
                                            pointing="left"
                                        >
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton
                                        postId={id}
                                        callback={deletePostCallback}
                                    />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <p style={{ textAlign: "center", margin: 0 }}>
                                    Post a Comment
                                </p>
                                <Form>
                                    <Card.Content>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                                ref={commentInputRef}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ""}
                                                onClick={submitComment}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Card.Content>
                                </Form>
                            </Card>
                        )}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user
                                        ? user.username ===
                                            comment.username && (
                                            <DeleteButton
                                                postId={id}
                                                commentId={comment.id}
                                            />
                                        )
                                        : ""}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id body createdAt username likeCount
            likes {
                username
            }
            commentCount
            comments {
                id username createdAt body
            }
        }
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id body createdAt username
            }
            commentCount
        }
    }
`;

export default SinglePost
