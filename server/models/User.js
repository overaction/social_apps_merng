const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    alarms: [{
        body: String,
        username: String,
        createdAt: String,
        postId: String
    }],
});

mongoose.model("User",userSchema);