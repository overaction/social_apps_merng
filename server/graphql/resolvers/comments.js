const { UserInputError,AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const Post = mongoose.model("Post");

const checkAuth = require('../../util/check-auth');

module.exports.commentResolver = {
    Mutation: {
        async createComment(_, {postId, body}, context) {
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
        },
        async deleteComment(_, {postId, commentId}, context) {
            checkAuth(context);
            const {username} = context.req.userinfo;
            
            const post = await Post.findById(postId);
            if(post) {
                const commentIdx = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIdx].username === username) {
                    post.comments.splice(commentIdx,1);
                    await post.save();
                    return post;
                }
                else {
                    throw new AuthenticationError('허용되지 않음');
                }
            }
            else {
                throw new UserInputError('해당 포스트가 없습니다');
            }
        }
    }
}