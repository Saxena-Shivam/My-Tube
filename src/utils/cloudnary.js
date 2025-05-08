import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

(async function () {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const uploadOnCloudinary = async (localfilePath) => {
        try {
            if (!localfilePath) return null;
            const result = await cloudinary.uploader.upload(localfilePath, {
                folder: "your-folder-name",
                resource_type: "auto",
            });
            console.log("Cloudinary uploaded on cloudinary :", response.url);
            return response.url;
        } catch (error) {
            fs.unlinkSync(localfilePath); // Delete the local file if upload fails
            return null;
        }
    };
});
export { uploadOnCloudinary };
