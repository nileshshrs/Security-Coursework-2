import mongoose from "mongoose";
import { compare, hash } from "../utils/bcrypt.js";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  image: { type: String, default: "" },
  bio: { type: String, default: "" },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  verified: { type: Boolean, default: false },
  mfaEnabled: { type: Boolean, default: false },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hash(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const userModel = mongoose.model("user", userSchema);

export default userModel;