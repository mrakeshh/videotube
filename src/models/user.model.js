import mongoose, { mongo, Schema, trusted } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String, 
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true,
        },
        coverImage: {
            type: String, 
        },
        watchHistory:[  //This is a array
            {
                type: Schema.Types.ObjectId, 
                ref: "Video"  //Video name bhako aafai linxa
            }
        ],
        password:{
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken:{
            type: String
        },
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);
