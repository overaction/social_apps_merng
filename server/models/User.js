const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    alarms: [{
        body: String,
        username: String,
        createdAt: String
    }],
});

mongoose.model("User",userSchema);