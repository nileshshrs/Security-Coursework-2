import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  getCartController,
  addToCartController,
  updateCartController,
  removeCartItemController,
} from "../controllers/cart.controller.js";
import { validate } from "../middleware/validate.js"; // your standard validate middleware


const cartRoutes = Router();

// All cart routes require authentication
cartRoutes.use(authenticate);

// Get current user's cart
cartRoutes.get("/get", getCartController);

// Add item to cart

cartRoutes.post("/add", validate(addToCartSchema), addToCartController);

// Patch: update quantity, size, or color of item
cartRoutes.patch("/update", validate(updateCartSchema), updateCartController);

// Remove item from cart
cartRoutes.delete(
  "/remove/:itemID",
  validate(itemIDParamSchema, "params"),
  validate(removeCartItemSchema, "body"),
  removeCartItemController
);
export default cartRoutes;
