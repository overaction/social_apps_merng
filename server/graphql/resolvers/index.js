const {postResolver} = require('./posts');
const {userResolver} = require('./users');
const {commentResolver} = require('./comments');
module.exports = {
    Query: {
        ...postResolver.Query
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