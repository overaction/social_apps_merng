const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
const {SECRET_KEY} = require('../../config/keys');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
const {validateRegisterInput, validateLoginInput} = require('../../util/validators');
const checkAuth = require('../../util/check-auth');

function generateToken(user) {
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    },SECRET_KEY,{expiresIn: '1h'})
    return token;
}

module.exports.userResolver = {
    Query: {
        async getUser(_,{username}) {
            try {
                const user = await User.findOne({username});
                if(user) {
                    return user;
                }
                else {
                    throw new Error('User not found')
                }
            } catch(err) {
                throw new Error(err);
            }
        }
    }, 
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
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                console.log(valid);
                throw new UserInputError('Errors',{errors})
            }
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
        },
        async createAlarm(_,{username,body,postId},context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            let otherUser = await User.findOne({username});
            if(!otherUser) {
                console.log('errrpr');
                console.log(otherUser);
                throw new UserInputError('user not found');
            }
            else {
                console.log('alarm!')
                const newAlarm = {
                    username: userinfo.username,
                    body,
                    createdAt: new Date().toISOString(),
                    postId
                }
                // 알람 추가
                otherUser = await User.findByIdAndUpdate(otherUser._id, {
                    $push: {alarms: newAlarm}
                }, {new: true})
            }
            await otherUser.save();
            return otherUser;
        },
        async deleteAlarm(_,{alarmId},context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            const username = userinfo.username;
            let user = await User.findOne({username});
            console.log(user);
            console.log(userinfo.id);
            if(!user) {
                console.log('errrpr');
                throw new UserInputError('user not found');
            }
            else {
                const newAlarm = {
                    _id: alarmId,
                }
                // 알람 삭제
                user = await User.findByIdAndUpdate(userinfo.id, {
                    $pull: {alarms: newAlarm}
                }, {new: true})
            }
            await user.save();
            return user;
        },
        async deleteAllAlarms(_,{},context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            const username = userinfo.username;
            let user = await User.findOne({username});
            if(!user) {
                console.log('errrpr');
                throw new UserInputError('user not found');
            }
            else {
                user = await User.findByIdAndUpdate(userinfo.id, {
                    $unset: {alarms:1}
                },{new: true})
            }
            await user.save();
            return user;
        }
    }
}