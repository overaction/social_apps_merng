const mongoose = require('mongoose');
const Post = mongoose.model("Post");

module.exports.postResolver = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch(err) {
                console.log(err);
            }
        }
    }
}