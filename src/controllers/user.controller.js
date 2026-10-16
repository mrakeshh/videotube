import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
 //step-1: get user details from frontend
 //step-2: validation
 //step-3: check if user already exists using username or email
 //step-4: check for images, check for avatar
 //step-5: upload them to cloudinary
 //step-6: create user object - create entry in db
 //step-7: remove password and refresh token field from response
 //step-8: check for user creation
 //step-9: return response

 const {fullName, email, username, password} = req.body

 if([fullName, email, username, password].some((field)=> field?.trim() === "")){
    throw new ApiError(400, "All fields are required")
 }

 const existedUser = User.findOne({
    $or: [email, username]
 })
 if(existedUser){
   throw new ApiError(409, "User with email or username already exists!!")
 }
 
 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
 }


});

export { registerUser };
