import { Router } from "express";
import { createClothesController, deleteClothesController, getAllClothesController, getClothesByIdController, updateClothesController } from "../controllers/clothes.controller.js";
import { validate } from "../middleware/validate.js";
import { createClothesSchema, idParamSchema, updateClothesSchema } from "../utils/schema.js";

const clothesRoutes = Router();

// Create a clothing item (POST /api/clothes)
clothesRoutes.post("/create", validate(createClothesSchema), createClothesController);
clothesRoutes.patch("/update/:id", validate(updateClothesSchema), updateClothesController);
clothesRoutes.delete("/delete/:id", deleteClothesController);
clothesRoutes.get("/get-all", getAllClothesController);
clothesRoutes.get("/get/:id", validate(idParamSchema, "params"), getClothesByIdController);

export default clothesRoutes;
