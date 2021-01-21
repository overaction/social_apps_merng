import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useState } from 'react'
import {Button, Form} from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import { useForm } from '../utils/hooks';

const PostForm = () => {
    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    });
    const [errors, setErrors] = useState('');

    const [createPost, {loading,error}] = useMutation(CREATE_POST_MUTATION, {
        update(cache,result) {
            // createPost result
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY
            });
            // readQuery, writeQuery를 통한 실시간 UI rendering
            // https://stackoverflow.com/questions/58206190/apollo-usequery-hook-doesnt-get-update-from-cache-with-writequery-method-no
            const newPost = result.data.createPost
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {getPosts: [newPost, ...data.getPosts]}
            })
            values.body = ''
        },
        onError(err) {
            console.log(err.graphQLErrors[0].message);
            setErrors(err.graphQLErrors[0].message);
        },
        variables: values
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a Post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi world!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className="list">{errors}</ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost(
        $body: String!
    ) {
        createPost(
            body: $body
        ) {
        id
        body
        createdAt
        username
        comments {
            id createdAt username body
        }
        likes {
            id createdAt username
        }
        likeCount
        commentCount
        }
    }
`;

export default PostForm;
