const { AuthenticationError, UserInputError } = require('apollo-server');
const mongoose = require('mongoose');
const Post = mongoose.model("Post");

const checkAuth = require('../../util/check-auth');

module.exports.postResolver = {
    Query: {
        async getPosts() {
            try {
                const post = await Post.find().populate('user')
                console.log(post);
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
            if(body.trim() === '') throw new Error('내용을 입력해주세요')
            checkAuth(context);
            const userinfo = context.req.userinfo;
            const newPost = new Post({
                body,
                user: userinfo.id,
                username: userinfo.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();

            context.pubsub.publish('NEW_POST',{
                newPost: post
            })
            return post;
        },
        async deletePost(_,{postId},context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            try {
                const post = await Post.findOne({_id: postId});
                if(userinfo.username === post.username) {
                    await post.delete();
                    return '게시글이 삭제되었습니다.'
                } else {
                    throw new AuthenticationError('게시글 삭제가 실패')
                }
            } catch (err){
                throw new Error(err);
            }
        },
        async likePost(_,{postId},context) {
            checkAuth(context);
            const userinfo = context.req.userinfo;
            let post = await Post.findById(postId);
            if(post) {
                if(post.likes.find(like => like.username === userinfo.username)) {
                    // 이미 좋아요 표시를 함
                    post.likes = post.likes.filter(like => like.username !== userinfo.username);
                }
                else {
                    const like = {
                        username: userinfo.username,
                        createdAt: new Date().toISOString()
                    }
                    // 새로 좋아요 표시
                    post = await Post.findByIdAndUpdate(postId, {
                        $push:{likes:like}
                    },{new:true})
                }
                // 저장
                await post.save();
                return post;
            }
            else throw new UserInputError('포스트가 존재하지 않습니다');
        },
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_POST')
        }
    }
}