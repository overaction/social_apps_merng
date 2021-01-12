const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

require('./models/User');
require('./models/Post');
const {MONGOURI} = require('./config/keys.js');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});
// 

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
.then(() => {
    console.log('MongoDB connected');
    return server.listen({port: 5000});
})
.then((res) => {
    console.log(`Server running on ${res.url}`);
})