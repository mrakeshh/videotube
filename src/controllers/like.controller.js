import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    let isLiked;

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    if(existingLike){
        await existingLike.deleteOne()
        isLiked = false
    } else{
        await Like.create(
            {
                video: videoId,
                likedBy: req.user._id
            }
        )
        isLiked = true
    }

     return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked}, isLiked? "Liked the video": "Unliked the video")
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "comment not found")
    }

    let isLiked;

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if(existingCommentLike){
        await existingCommentLike.deleteOne()
        isLiked = false
    } else{
        await Like.create(
            {
                comment: commentId,
                likedBy: req.user._id
            }
        )
        isLiked = true
    }

     return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked}, isLiked? "Liked the comment": "Unliked the comment")
    )
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
     if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }
    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "tweet not found")
    }

    let isLiked;

    const existingTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })
    if(existingTweetLike){
        await existingTweetLike.deleteOne()
        isLiked = false
    } else{
        await Like.create(
            {
                tweet: tweetId,
                likedBy: req.user._id
            }
        )
        isLiked = true
    }

     return res
    .status(200)
    .json(
        new ApiResponse(200, {isLiked}, isLiked? "Liked the tweet": "Unliked the tweet")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}