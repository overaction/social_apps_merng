const {postResolver} = require('./posts');
const {userResolver} = require('./users');
const {commentResolver} = require('./comments');
module.exports = {
    Post: {
        likeCount(parent) {
            console.log(parent);
            return parent.likes.length;
        },
        commentCount: (parent) => parent.comments.length
    },
    User: {
        alarmCount: (parent) => parent.alarms.length
    },
    Query: {
        ...postResolver.Query,
        ...userResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation,
        ...commentResolver.Mutation,
    },
    Subscription: {
        ...postResolver.Subscription
    }
}