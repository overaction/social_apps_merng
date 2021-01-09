const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
});

mongoose.model("User",userSchema);