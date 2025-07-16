import {
  createOrderFromCart,
  getOrdersForUser,
  getAllOrders,
  cancelOrderByUser,
  updateOrderStatusByAdmin
} from "../service/order.service.js";
import assertAdmin from "../utils/assertAdmin.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK } from "../utils/constants/http.js";

// User: Place order
export const placeOrderController = catchErrors(async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });

  const order = await createOrderFromCart({
    userID: req.userID,
    address,
  });
  res.status(CREATED).json({ message: "Order placed", order });
});

// User: Get their own orders
export const getUserOrdersController = catchErrors(async (req, res) => {
  const orders = await getOrdersForUser(req.userID);
  res.status(OK).json({ orders });
});

// Admin: Get all orders
export const getAllOrdersController = catchErrors(async (req, res) => {
  await assertAdmin(req); // Admin check here
  const orders = await getAllOrders();
  res.status(OK).json({ orders });
});

// User: Cancel their order
export const cancelOrderController = catchErrors(async (req, res) => {
  const { orderID } = req.params;
  const order = await cancelOrderByUser({ userID: req.userID, orderID });
  res.status(OK).json({ message: "Order cancelled", order });
});

// Admin: Update order status
export const adminUpdateOrderStatusController = catchErrors(async (req, res) => {
  await assertAdmin(req); // Admin check here
  const { orderID } = req.params;
  const { status } = req.body;
  const order = await updateOrderStatusByAdmin({ orderID, status });
  res.status(OK).json({ message: "Order status updated", order });
});
