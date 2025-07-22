import { Router } from "express";
import { uploadImage } from "../middleware/multer.js";
import { uploadImageController } from "../controllers/upload.controller.js";
import { uploadLimiter } from "../middleware/ratelimiter.js";
import authenticate from "../middleware/authenticate.js";

const uploadRoutes = Router();

uploadRoutes.post(
  "/image",
  uploadLimiter,
  authenticate,
  (req, res, next) => {
    // Wrap multer middleware call here
    uploadImage.single("image")(req, res, (err) => {
      if (err) {
        // Multer error or other error
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        // File rejected by fileFilter (wrong mimetype)
        return res.status(400).json({ error: "Only image files are allowed" });
      }
      // If no errors, proceed to your controller
      uploadImageController(req, res, next);
    });
  }
);

export default uploadRoutes;
