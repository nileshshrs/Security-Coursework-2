import userModel from "../models/user.model.js";
import catchErrors from "../utils/catchErrors.js";
import assertAdmin from "../utils/assertAdmin.js";
import { OK, NOT_FOUND, FORBIDDEN } from "../utils/constants/http.js";
import { hash } from "../utils/bcrypt.js";

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

    const user = await userModel.findById(req.userID);
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found." });

    // Only allow role update if admin
    if ("role" in updates && user.role !== "admin") {
        return res.status(FORBIDDEN).json({ message: "Not authorized to update role." });
    }

    // If password is being updated, hash it
    if ("password" in updates && updates.password) {
       const hashed = await hash(updates.password);
       user.password = hashed
    }

    // Update other fields
    const updatableFields = ["username", "email", "bio", "image", "mfaEnabled"];
    for (const field of updatableFields) {
        if (field in updates) user[field] = updates[field];
    }

    await user.save(); // This will trigger pre-save hook if needed
    const safeUser = user.omitPassword();

    res.status(OK).json({ message: "Profile updated successfully.", user: safeUser });
});


// Delete self
export const deleteSelfController = catchErrors(async (req, res) => {
    const user = await userModel.findByIdAndDelete(req.userID);
    if (!user) return res.status(NOT_FOUND).json({ message: "User not found." });
    res.status(OK).json({ message: "User deleted." });
});
