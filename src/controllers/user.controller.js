import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { response } from "express"

const registerUser = asyncHandler(async (req, res)=>{
    // get user details from frontend

    const {fullName, email, username, password} = req.body
    console.log("email : ", email)

    // validation - not empty

    if(
        [fullName, email, username, password].some((field)=> field.trim()=== "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: username, email

    const existedUser = User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }
    // check for images, check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    // upload to cloudinary, avatar
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    // crate user object - create entry in db

    const user = User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    // remove password and refresh token field from response
    const createrUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check for user creation
    if(!createrUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    // return response
    return response.status(201).json(
        new ApiResponse(200, createrUser, "User registered successfully")
    )

})

export {registerUser}