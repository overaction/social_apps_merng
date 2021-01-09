const {ApolloServer} = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

require('./models/Post');
const Post = mongoose.model("Post");
const {MONGOURI} = require('./config/keys.js');

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Query {
        getPosts: [Post]
    }
`

const resolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch(err) {
                console.log(err);
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// 
// mongodb+srv://user:<password>@cluster0.lj26x.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    return server.listen({port: 5000});
})
.then((res) => {
    console.log(`Server running on ${res.url}`);
})