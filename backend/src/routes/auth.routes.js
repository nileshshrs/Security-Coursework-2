import { Router } from "express";
import { loginController, logoutController, refreshController, registerController, resetPasswordController, sendPasswordResetController, verifyEmailController } from "../controllers/auth.controller.js";


const authRoutes = Router()
authRoutes.post("/sign-up", registerController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)
authRoutes.post("/refresh", refreshController)
authRoutes.post("/account-recovery", sendPasswordResetController)
authRoutes.post("/reset-password", resetPasswordController)
authRoutes.post("/verify-email/:code", verifyEmailController)


export default authRoutes