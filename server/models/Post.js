const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body: String,
    username: String,
    createdAt: String,
    comments: [{
        body: String,
        username: String,
        createdAt: String
    }],
    likes: [{
        username: String,
        createdAt: String
    }],
    user: {
        type: ObjectId,
        ref: "User"
    }
});

mongoose.model("Post",postSchema);