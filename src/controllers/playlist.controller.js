import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import {Video} from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name.trim()) {
    throw new ApiError(400, "Name is required to create a playlist");
  }
  const playlist = await Playlist.create({
    name: name.trim(),
    description: description || "",
    owner: req.user._id
  })

  return res
  .status(201)
  .json(
    new ApiResponse(201, playlist, "Playlist created successfully")
  )

});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID")
  }
  const userPlaylists = await Playlist.find({ owner: userId }).sort({ createdAt: -1})
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, userPlaylists, "user playlists fetched successfully")
  )
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID")
  }
  const playlist = await Playlist.findById(playlistId)
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, playlist, "user playlists fetched successfully")
  )
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID or playlist ID")
  }
  const playlist = await Playlist.findById(playlistId)
  const video = await Video.findById(videoId)

  if(!playlist){
    throw new ApiError(404, "Playlist not found")
  }
  if(!video){
    throw new ApiError(404, "video not found")
  }

  const isOwner =
    req.user?._id?.toString() === playlist?.owner?.toString();

  if (!isOwner) {
    throw new ApiError(403, "You are not allowed to add videos to this playlist");
  }

  // // make another database call
  // const updatedPlaylist = await Playlist.findByIdAndUpdate(
  //   playlistId,
  //   { $addToSet: { videos: video._id } },
  //   { returnDocument: "after" }
  // )
  const alreadyAdded = playlist.videos.some((id)=> id.toString() === video._id.toString())
  if(alreadyAdded){
    throw new ApiError(400, "Video already in the playlist")
    
  }

  playlist.videos.push(video._id)
  await playlist.save()
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, playlist, "Video added to the playlist")
  )

});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  
  if (!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID or playlist ID")
  }
  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id
    },
    {
      $pull: {videos: videoId}
    },
    {
      returnDocument: "after"
    }
  )
  if (!playlist) {
    throw new ApiError(400, "Failed to delete the video from the playlist")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, playlist, "Video deleted from playlist successfully")
  )

  
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
