const mongoose = require('mongoose');
const User = mongoose.model('User');

const {SECRET_KEY} = require('../../config/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

module.exports.userResolver = {
    Mutation: {
        async register(_, {registerInput: {username, email, password, confirmPassword}}) {
            // TODO: validate user data
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({username})
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            passsword = await bcrypt.hash(password,12);
            const newUser = new User({
                username,
                email,
                password,
                confirmPassword,
                createdAt: new Date().toISOString()
            });
            const res = await newUser.save();
            console.log(res);
            const token = jwt.sign({
                id: res._id,
                email: res.email,
                username: res.username
            },SECRET_KEY,{expiresIn: '1h'})
            console.log(res._doc);
            return {
                id:res._id,
                username:res.username,
                email:res.email,
                password:res.password,
                createdAt:res.createdAt,
                token
            }
        }
    }
}