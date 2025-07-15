import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clothes",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true, // One cart per user
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
