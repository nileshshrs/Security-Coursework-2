import { Router } from "express";
import { uploadImage } from "../middleware/multer.js";
import {  uploadImageController } from "../controllers/upload.controller.js";

const uploadRoutes = Router();
uploadRoutes.post("/image", uploadImage.single("image"), uploadImageController)

export default uploadRoutes;