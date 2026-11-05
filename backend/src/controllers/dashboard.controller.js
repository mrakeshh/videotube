import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // Get the channel stats like total video views,
  // total subscribers, total videos, total likes etc.

  const totalSubscribers = await Subscription.countDocuments({
    channel: req.user._id,
  });
  const totalVideosAndViews = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  const videoIds = await Video.find({ owner: req.user._id }).distinct("_id");
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  const stats = {
    totalVideos: totalVideosAndViews[0]?.totalVideos || 0,
    totalViews: totalVideosAndViews[0]?.totalViews || 0,
    totalSubscribers,
    totalLikes,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel Stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // Get all the videos uploaded by the channel
 const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const aggregate = Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
  ]);

  const videos = await Video.aggregatePaginate(aggregate, {
    page,
    limit,
    sort: { createdAt: -1, _id: -1 },
    customLabels: { docs: "videos", totalDocs: "totalVideos" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        videos,
        "Channel videos fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
