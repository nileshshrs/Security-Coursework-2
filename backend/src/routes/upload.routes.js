import { Router } from "express";
import { uploadImage } from "../middleware/multer.js";
import {  uploadImageController } from "../controllers/upload.controller.js";
import { uploadLimiter } from "../middleware/ratelimiter.js";
import authenticate from "../middleware/authenticate.js";

const uploadRoutes = Router();
uploadRoutes.post("/image", uploadLimiter, authenticate, uploadImage.single("image"), uploadImageController)

export default uploadRoutes;