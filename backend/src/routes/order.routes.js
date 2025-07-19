import express from "express";
import { adminUpdateOrderStatusController, cancelOrderController, getAllOrdersController, getUserOrdersController, placeOrderController } from "../controllers/order.controller.js";
import authenticate from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { orderIDParamSchema, placeOrderSchema, updateOrderStatusSchema } from "../utils/schema.js";


const orderRoutes = express.Router();

// Place order (user)
orderRoutes.post("/", authenticate, validate(placeOrderSchema), placeOrderController);
// Get all orders of current user
orderRoutes.get("/", authenticate, getUserOrdersController);

// Get all orders (admin only, admin checked in controller)
orderRoutes.get("/all", authenticate, getAllOrdersController);

// Cancel order (user only, must own order)
orderRoutes.patch(
    "/cancel/:orderID",
    authenticate,
    validate(orderIDParamSchema, "params"),
    cancelOrderController
);
// Update order status (admin only, admin checked in controller)
orderRoutes.put(
    "/:orderID",
    authenticate,
    validate(orderIDParamSchema, "params"),
    validate(updateOrderStatusSchema),
    adminUpdateOrderStatusController
);
export default orderRoutes;
