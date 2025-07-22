import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  resetPasswordController,
  sendPasswordResetController,
  verifyEmailController,
  verifyMfaController,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerSchema,
  sendPasswordResetSchema,
  passwordResetSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  mfaCodeSchema,
} from "../utils/schema.js";
import { authLimiter } from "../middleware/ratelimiter.js";

const authRoutes = Router();

authRoutes.post("/sign-up", validate(registerSchema), registerController);
authRoutes.post("/sign-in", authLimiter, validate(loginSchema), loginController);
authRoutes.get("/logout", logoutController);
authRoutes.post("/refresh", validate(refreshTokenSchema), refreshController);
authRoutes.post("/account-recovery", authLimiter, validate(sendPasswordResetSchema), sendPasswordResetController);
authRoutes.post("/reset-password", validate(passwordResetSchema), resetPasswordController);
authRoutes.post("/verify-email/:code", validate(verifyEmailSchema, "params"), verifyEmailController);
authRoutes.post("/verify-mfa",authLimiter, validate(mfaCodeSchema), verifyMfaController);


export default authRoutes;
