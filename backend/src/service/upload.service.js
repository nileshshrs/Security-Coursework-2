import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

