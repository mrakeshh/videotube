import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  const {
    query = "",
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const allowedSortFields = ["createdAt", "views", "duration", "title"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = sortType === "asc" ? 1 : -1;

  // building the filter

  const match = {};

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid ID format");
    }
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  const isViewingOwnVideo = userId && req.user?._id?.toString() === userId;
  if (!isViewingOwnVideo) {
    match.isPublished = true;
  }

  const search = query.trim();
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    match.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  //pipeline
  const aggregate = Video.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        videoFile: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: 1,
      },
    },
  ]);

  //letting the plugin do sort, skip, limit and counting
  const videos = await Video.aggregatePaginate(aggregate, {
    page,
    limit,
    sort: { [sortField]: sortOrder, _id: sortOrder },
    customLabels: { docs: "videos", totalDocs: "totalVideos" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "title and description are required fields");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!(videoLocalPath && thumbnailLocalPath)) {
    throw new ApiError(400, "Video or thumbnail file not found");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(500, "Error while uploading videoFile on cloudinary");
  }
  if (!thumbnail) {
    throw new ApiError(500, "Error while uploading thumbnail on cloudinary");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description: description,
    duration: videoFile.duration,
    isPublished,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video id")
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {$inc: {views: 1}},
    { returnDocument: "after"}
  ).populate("owner", "fullName username avatar")

  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const isOwner = req.user?._id?.toString() === video.owner._id.toString()
  if (!isOwner && !video.isPublished) {
    throw new ApiError(404, "Video not found")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "fetched video by id successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
