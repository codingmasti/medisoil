import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

//configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



//to uploade file to cloudinary

export async function uploadToCloudinary(filePath, folder="Doctor"){
    try {
        const result = await cloudinary.uploader.upload(filePath,{
            folder,
            resource_type: "image"
        });

        //remove the local file after uploade
        fs.unlinkSync(filePath)
        return result;
    } catch (error) {
        console.error("CLOUDINARY UPLOAD ERROR: ",error);
        throw error;
    }
}


//to delete an image that is present in cloudinary if user remove from the ID

export async function deleteFromCloudinary(publicID){
    try{
        if(!publicID) return;
        await cloudinary.uploader.destroy(publicID);
    }catch(err){
        console.error("CLOUDINARY DELETE ERROR: ",err);
        throw err;
    }
}

export default cloudinary;