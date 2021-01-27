const {ApolloServer, PubSub} = require('apollo-server');
const mongoose = require('mongoose');

require('./models/User');
require('./models/Post');
const {MONGOURI} = require('./config/keys.js');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub})
});
// 

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(() => {
    console.log('MongoDB connected');
    return server.listen({port: PORT});
})
.then((res) => {
    console.log(`Server running on ${res.url}`);
})
.catch(err => {
    console.log(err);
})