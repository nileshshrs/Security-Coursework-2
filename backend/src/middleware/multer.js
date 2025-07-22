import multer from "multer";

// Memory storage (used for streaming to Cloudinary)
const storage = multer.memoryStorage();

// Image-only filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
    next()
  }
};


// Export two specific upload middlewares
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for images
});

