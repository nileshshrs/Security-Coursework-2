import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  getCartController,
  addToCartController,
  updateCartController,
  removeCartItemController,
} from "../controllers/cart.controller.js";

const cartRoutes = Router();

// All cart routes require authentication
cartRoutes.use(authenticate);

// Get current user's cart
cartRoutes.get("/get", getCartController);

// Add item to cart
cartRoutes.post("/add", addToCartController);

// Patch: update quantity, size, or color of item
cartRoutes.patch("/update", updateCartController);

// Remove item from cart
cartRoutes.delete("/remove/:itemID", removeCartItemController);

export default cartRoutes;
