import { Router } from "express";
import { createClothesController } from "../controllers/clothes.controller.js";
import { validate } from "../middleware/validate.js";
import { createClothesSchema } from "../utils/schema.js";

const clothesRoutes = Router();

// Create a clothing item (POST /api/clothes)
clothesRoutes.post("/create", validate(createClothesSchema), createClothesController);

export default clothesRoutes;
