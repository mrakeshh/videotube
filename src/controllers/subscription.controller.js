import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //toggle subscription

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const channelExists = await User.exists({ _id: channelId });
  if (!channelExists) {
    throw new ApiError(404, "Channel doesn't exist");
  }
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  let isSubscribed;

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    isSubscribed = false;
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    isSubscribed = true;
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSubscribed },
        isSubscribed ? "Subscribed to the channel" : "Unsubscribed the channel"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscribers = await Subscription.aggregate([
    { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
      },
    },
    {
      $unwind: "$subscriber",
    },
    { $replaceRoot: { newRoot: "$subscriber" } },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribers, totalSubscribers: subscribers.length },
        "Subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid Subscriber ID");
  }

  const channel = await Subscription.aggregate([
    { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channels",
        pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
      },
    },
    {
      $unwind: "$channels",
    },

    { $replaceRoot: { newRoot: "$channels" } },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { channel, totalSubscribedChannels: channel.length },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
