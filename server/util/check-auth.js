const {AuthenticationError} = require('apollo-server');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config/keys');
module.exports = (context) => {
    const {authorization} = context.req.headers;
    if(!authorization) {
        throw new Error('Authentication header must be provided');
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, SECRET_KEY, (err,payload) => {
        if(err) {
            console.log(err);
            throw new AuthenticationError('유효하지 않은 토큰',err);
        }
        context.req.userinfo = payload;
    })
}