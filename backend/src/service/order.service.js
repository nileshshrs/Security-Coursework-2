import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Clothes from "../models/clothes.model.js";
import appAssert from "../utils/appAssert.js";
import { NOT_FOUND, BAD_REQUEST, FORBIDDEN } from "../utils/constants/http.js";

export const createOrderFromCart = async ({ userID, address }) => {
  const cart = await Cart.findOne({ user: userID });
  appAssert(cart && cart.items.length > 0, BAD_REQUEST, "Cart is empty.");

  let total = 0;
  const orderItems = [];

  for (const ci of cart.items) {
    const product = await Clothes.findById(ci.item);
    appAssert(product, NOT_FOUND, "Product not found");

    // Case-insensitive size check
    appAssert(
      product.size.map((s) => s.toLowerCase()).includes(ci.size.toLowerCase()),
      BAD_REQUEST,
      "Invalid size"
    );
    // Case-insensitive color check
    appAssert(
      product.color.map((c) => c.toLowerCase()).includes(ci.color.toLowerCase()),
      BAD_REQUEST,
      "Invalid color"
    );

    total += product.price * ci.quantity;

    orderItems.push({
      item: ci.item,
      quantity: ci.quantity,
      size: ci.size,
      color: ci.color,
      price: product.price
    });
  }

  const order = await Order.create({
    user: userID,
    items: orderItems,
    total,
    address,
    status: "pending"
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getOrdersForUser = async (userID) => {
  return Order.find({ user: userID })
    .sort({ createdAt: -1 })
    .populate("items.item");
};

export const getAllOrders = async () => {
  return Order.find()
    .sort({ createdAt: -1 })
    .populate("user")
    .populate("items.item");
};

export const cancelOrderByUser = async ({ userID, orderID }) => {
  const order = await Order.findById(orderID);
  appAssert(order, NOT_FOUND, "Order not found.");
  appAssert(order.user.toString() === userID, FORBIDDEN, "Cannot cancel others' orders.");
  appAssert(order.status === "pending" || order.status === "processing", BAD_REQUEST, "Cannot cancel after shipped/delivered.");

  order.status = "cancelled";
  await order.save();
  return order;
};

export const updateOrderStatusByAdmin = async ({ orderID, status }) => {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  appAssert(validStatuses.includes(status), BAD_REQUEST, "Invalid status.");

  const order = await Order.findById(orderID);
  appAssert(order, NOT_FOUND, "Order not found.");

  order.status = status;
  await order.save();
  return order;
};
