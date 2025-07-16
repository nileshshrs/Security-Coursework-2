import { addItemToCart, getOrCreateCart, patchCartItem, removeCartItem } from "../service/cart.service.js";
import catchErrors from "../utils/catchErrors.js";
import { OK } from "../utils/constants/http.js";

export const getCartController = catchErrors(async (req, res) => {
  const cart = await getOrCreateCart(req.userID);
  await cart.populate("items.item");
  return res.status(OK).json({ cart });
});

export const addToCartController = catchErrors(async (req, res) => {
  const { itemID, quantity = 1, size, color } = req.body;
  const cart = await addItemToCart({
    userID: req.userID,
    itemID,
    quantity,
    size,
    color,
  });
  await cart.populate("items.item");
  return res.status(OK).json({ message: "Item added to cart", cart });
});

// *** PATCH item in cart. Identify item by itemID + size + color ***
export const updateCartController = catchErrors(async (req, res) => {
  const { itemID, size, color, quantity } = req.body;
  const cart = await patchCartItem({
    userID: req.userID,
    itemID,
    size,
    color,
    quantity,
  });
  await cart.populate("items.item");
  return res.status(OK).json({ message: "Cart item updated", cart });
});

// *** Remove item from cart. Identify item by itemID + size + color ***
export const removeCartItemController = catchErrors(async (req, res) => {
  const { itemID } = req.params;
  const { size, color } = req.body;
  const cart = await removeCartItem({
    userID: req.userID,
    itemID,
    size,
    color
  });
  await cart.populate("items.item");
  return res.status(OK).json({ message: "Item removed from cart", cart });
});
