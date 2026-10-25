import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async(localFilePath) => {
  try {
    if(!localFilePath) return null
    // Upload the file on cloudinary
     const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    //file has been uploaded successful
    fs.unlinkSync(localFilePath) 
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved file as the upload operation got failed
    return null;
  }
}

const getPublicIdFromUrl = (url)=>{
  if(!url) return null
  const afterUpload = url.split("/upload/")[1]
  if(!afterUpload) return null

  return afterUpload.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "")
}

const deleFromCloudinary = async (url, resourceType = "image") => {
  try {
    if(!url) return null
    const publicId = getPublicIdFromUrl(url)
    if(!publicId) return null
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
  } catch (error) {
    console.log("Cloudinary delete failed", error)
    return null
  }

}

export {
  uploadOnCloudinary,
  deleFromCloudinary
}

