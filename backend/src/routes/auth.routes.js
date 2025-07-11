import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  resetPasswordController,
  sendPasswordResetController,
  verifyEmailController,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerSchema,
  sendPasswordResetSchema,
  passwordResetSchema,
  verifyEmailSchema,
  refreshTokenSchema,
} from "../utils/schema.js";

const authRoutes = Router();

authRoutes.post("/sign-up", validate(registerSchema), registerController);
authRoutes.post("/sign-in", validate(loginSchema), loginController);
authRoutes.get("/logout", logoutController);
authRoutes.post("/refresh", validate(refreshTokenSchema), refreshController);
authRoutes.post("/account-recovery", validate(sendPasswordResetSchema), sendPasswordResetController);
authRoutes.post("/reset-password", validate(passwordResetSchema), resetPasswordController);
authRoutes.get("/verify-email/:code", validate(verifyEmailSchema, "params"), verifyEmailController);

export default authRoutes;
