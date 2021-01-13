import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';

const client = new ApolloClient({
    link: createHttpLink({ uri: "http://localhost:5000" }),
    cache: new InMemoryCache(),
})

const ApolloProviders = () => {
    return (
        <ApolloProvider client={client} >
            <App />
        </ApolloProvider>
    )
}

export default ApolloProviders;