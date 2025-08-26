const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV', // The name of the folder in your Cloudinary account
        allowed_formats: ['jpeg', 'png', 'jpg','webp'], // Allowed formats for the uploaded files
    },
});

module.exports = {
    cloudinary,
    storage,
};