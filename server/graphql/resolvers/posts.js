const mongoose = require('mongoose');
const Post = mongoose.model("Post");

const checkAuth = require('../../util/check-auth');

module.exports.postResolver = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({createdAt: -1});
                return posts;
            } catch(err) {
                console.log(err);
            }
        },
        async getPost(_,{postId}) {
            try {
                const post = await Post.findById(postId);
                if(post) {
                    return post;
                }
                else {
                    throw new Error('Post not found')
                }
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_,{body}, context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            const newPost = new Post({
                body,
                user: userinfo.id,
                username: userinfo.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            return post;
        }
    }
}