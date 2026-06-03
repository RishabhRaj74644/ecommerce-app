// import multer from 'multer'
// import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import cloudinary from '../config/cloudinary.js'

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'ecommerce/products',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       {
//         width: 800,
//         height: 800,
//         crop: 'limit',
//       },
//     ],
//   },
// })

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true)
//     } else {
//       cb(
//         new Error('Sirf image files allowed hain'),
//         false
//       )
//     }
//   },
// })

// export default upload



import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Image files allowed only"), false);
    }
  },
});

export default upload;



// import multer from 'multer'
// import { CloudinaryStorage } from 'multer-storage-cloudinary'
// import cloudinary from '../config/cloudinary.js'

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'ecommerce/products',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//   },
// })

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true)
//     } else {
//       cb(new Error('Sirf image files allowed hain'), false)
//     }
//   },
// })

// export default upload