const mongoose = require('mongoose');
const User = mongoose.model('User');

const {SECRET_KEY} = require('../../config/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');

function generateToken(user) {
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    },SECRET_KEY,{expiresIn: '1h'})
    return token;
}

module.exports.userResolver = {
    Mutation: {
        async login(_, { username, password }) {
            const {errors,valid} = validateLoginInput(username, password);
            if(!valid) {
                console.log(valid);
                throw new UserInputError('Errors',{errors});
            }
            const user = await User.findOne({username});
            if(!user) {
                console.log('errrpr');
                errors.general = "User not found"
                throw new UserInputError('user not found', {errors});
            }
            console.log(user);
            const match = await bcrypt.compare(password, user.password);
            console.log(password,user.password);
            if(!match) {
                errors.general = "아이디 또는 패스워드를 확인해주세요";
                throw new UserInputError('Wrong', {errors});
            }
            const token = generateToken(user);
            console.log(token);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(_, {registerInput: {username, email, password, confirmPassword}}) {
            // TODO: validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                console.log(valid);
                throw new UserInputError('Errors',{errors})
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({username})
            if(user) {
                throw new UserInputError('해당 닉네임이 이미 존재합니다', {
                    errors: {
                        username: '해당 닉네임이 이미 존재합니다'
                    }
                })
            }

            password = await bcrypt.hash(password,12);
            const newUser = new User({
                username,
                email,
                password,
                confirmPassword,
                createdAt: new Date().toISOString()
            });
            const res = await newUser.save();
            
            const token = generateToken(res._doc);
            console.log(token);
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