import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!isValidObjectId(videoId)) {
        throw new ApiError(200, "Invalid video ID")
    }
    const aggregateComment = Comment.aggregate([
        {$match: {video: videoId}},
        {$lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{
                $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                }
            }]
        }},
        {$unwind: "$owner"}
    ])
    const comments = await Comment.aggregatePaginate(aggregateComment, {
        page,
        limit,
        sort: { createdAt: -1},
        customLabels: {docs: "comments", totalDocs: "totalComments"}
    })
    return res
    .status(200)
    .json(new ApiResponse(200, comments, "All comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }
