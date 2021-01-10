const { UserInputError,AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const Post = mongoose.model("Post");

const checkAuth = require('../../util/check-auth');

module.exports.commentResolver = {
    Mutation: {
        createComment: async(_, {postId, body}, context) => {
            checkAuth(context);
            const {username} = context.req.userinfo;
            if(body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: '내용을 입력해주세요'
                    }
                })
            }

            const post = await Post.findById(postId);
            if(post) {
                // 배열의 첫번째 원소로 넣기(unshift)
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            }
            else throw new UserInputError('Post not found');
        }
    }
}