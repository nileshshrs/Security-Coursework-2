import userModel from "../models/user.model.js";
import catchErrors from "../utils/catchErrors.js";
import assertAdmin from "../utils/assertAdmin.js";
import { OK, NOT_FOUND, FORBIDDEN } from "../utils/constants/http.js";

// Get all users (admin only)
export const getAllUsersController = catchErrors(async (req, res) => {
  await assertAdmin(req);
  const users = await userModel.find().select("-password");
  res.status(OK).json({ message: "Users fetched successfully.", users });
});

// Get self
export const getSelfController = catchErrors(async (req, res) => {
  const user = await userModel.findById(req.userID).select("-password");
  if (!user) return res.status(NOT_FOUND).json({ message: "User not found." });
  res.status(OK).json({ user });
});

// Patch self, only allow role update if admin
export const patchSelfController = catchErrors(async (req, res) => {
  const updates = { ...req.body };
  // Only admin can update role
  if ("role" in updates) {
    const currentUser = await userModel.findById(req.userID).select("role");
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(FORBIDDEN).json({ message: "Not authorized." });
    }
  }
  const user = await userModel.findByIdAndUpdate(
    req.userID,
    updates,
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) return res.status(NOT_FOUND).json({ message: "User not found." });
  res.status(OK).json({ message: "Profile updated successfully." });
});

// Delete self
export const deleteSelfController = catchErrors(async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.userID);
  if (!user) return res.status(NOT_FOUND).json({ message: "User not found." });
  res.status(OK).json({ message: "User deleted." });
});
