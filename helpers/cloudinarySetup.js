import { v2 as cloudinaryV2 } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config()
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname)
    }
})

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {

        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;