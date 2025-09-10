// cloudinary.js
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const streamifier = require("streamifier");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image buffer to Cloudinary using streamifier
const uploadToCloudinary = (buffer, folder = "") => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
        secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

// Function to delete image from Cloudinary by public_id
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};