const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-storage');
const multer = require('multer');


//cloudinary keys
cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage ({
    cloudinary,
    folder:
})