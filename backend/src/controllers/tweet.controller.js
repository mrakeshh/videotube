import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //  create tweet
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content for tweet is required")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    if (!tweet) {
        throw new ApiError(400, "Error while creating tweet")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    //   get user tweets
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID")
    }

    const tweets = await Tweet
    .find({owner: userId})
    .sort({createdAt: -1})
    .populate("owner", "username avatar")

    if (!tweets) {
        throw new ApiError(400, "tweets not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    //  update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400, "Invalid tweet id")
    }

    if(!content.trim()){
        throw new ApiError(400, "Add content to update")
    }
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(req?.user?._id?.toString() !== tweet?.owner?.toString()){
        throw new ApiError(403, "You are not allowed to update this tweet")
    }
    
    tweet.content = content.trim()
    await tweet.save({validateBeforeSave: false}) 

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //  delete tweet
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400, "Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(req?.user?._id?.toString() !== tweet?.owner?.toString()){
        throw new ApiError(403, "You are not allowed to delete this tweet")
    }
    await tweet.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    )


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
