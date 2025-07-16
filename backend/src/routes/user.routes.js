import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
  getAllUsersController,
  getSelfController,
  patchSelfController,
  deleteSelfController,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/all", authenticate, getAllUsersController);      // GET /user/all (admin)
userRoutes.get("/", authenticate, getSelfController);             // GET /user
userRoutes.patch("/", authenticate, patchSelfController);         // PATCH /user
userRoutes.delete("/", authenticate, deleteSelfController);       // DELETE /user

export default userRoutes;
