import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
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
    // check for images, check for avatar
    // upload to cloudinary, avatar
    // crate user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
})

export {registerUser}