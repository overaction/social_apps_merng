const {gql} = require('apollo-server')

module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    type Alarm {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        postId: ID!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        alarms: [Alarm]!
        alarmCount: Int!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getUser(username: String!): User
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
        createAlarm(username: String!, body: String!, postId: ID!): User!
        deleteAlarm(alarmId: ID!): User!
        deleteAllAlarms: User!
    }
    type Subscription {
        newPost: Post!
    }
`