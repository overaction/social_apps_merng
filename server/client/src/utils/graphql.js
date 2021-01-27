import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`;

export const ALARM_MUTATION = gql`
    mutation createAlarm($username: String!, $body: String!) {
        createAlarm(username: $username, body: $body) {
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