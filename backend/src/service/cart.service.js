import Cart from "../models/cart.model.js";
import Clothes from "../models/clothes.model.js";
import appAssert from "../utils/appAssert.js";
import { NOT_FOUND, BAD_REQUEST } from "../utils/constants/http.js";

export const getOrCreateCart = async (userID) => {
    let cart = await Cart.findOne({ user: userID });
    if (!cart) {
        cart = await Cart.create({ user: userID, items: [] });
    }
    return cart;
};

export const addItemToCart = async ({ userID, itemID, quantity, size, color }) => {
    const product = await Clothes.findById(itemID);

    appAssert(product, NOT_FOUND, "Item not found.");
    appAssert(
        product.size.some((s) => s.toLowerCase() === size.toLowerCase()),
        BAD_REQUEST,
        "Invalid size."
    );
    appAssert(
        product.color.some((c) => c.toLowerCase() === color.toLowerCase()),
        BAD_REQUEST,
        "Invalid color."
    );

    const cart = await getOrCreateCart(userID);

    // Find using itemID + size + color
    const existing = cart.items.find(
        i => i.item.toString() === itemID && i.size === size && i.color === color
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.items.push({ item: itemID, quantity, size, color });
    }

    await cart.save();
    return cart;
};

// PATCH must use all 3 as identity
export const patchCartItem = async ({ userID, itemID, size, color, quantity }) => {
    const cart = await Cart.findOne({ user: userID });
    appAssert(cart, NOT_FOUND, "Cart not found.");

    // Find using itemID + size + color
    const item = cart.items.find(
        i => i.item.toString() === itemID && i.size === size && i.color === color
    );
    appAssert(item, NOT_FOUND, "Item not found in cart.");

    // Validate against product
    const product = await Clothes.findById(itemID);
    if (size) appAssert(product.size.some((s) => s.toLowerCase() === size.toLowerCase()), BAD_REQUEST, "Invalid size.");
    if (color) appAssert(product.color.some((c) => c.toLowerCase() === color.toLowerCase()), BAD_REQUEST, "Invalid color.");

    if (quantity !== undefined) item.quantity = quantity;
    // If you want to allow patching size/color to new values, handle here (optional)

    await cart.save();
    return cart;
};

// Remove must use all 3 as identity
export const removeCartItem = async ({ userID, itemID, size, color }) => {
  const cart = await Cart.findOne({ user: userID });
  appAssert(cart, NOT_FOUND, "Cart not found.");

  cart.items = cart.items.filter(
    i =>
      !(
        i.item.toString() === itemID &&
        i.size === size &&
        i.color === color
      )
  );

  await cart.save();
  return cart;
};
