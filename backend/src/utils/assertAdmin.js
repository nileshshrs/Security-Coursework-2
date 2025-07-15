import appAssert from "./appAssert.js";
import { FORBIDDEN } from "../utils/constants/http.js";
import userModel from "../models/user.model.js";

/**
 * Throws if the user is not an admin.
 * Usage: await assertAdmin(req);
 */
export default async function assertAdmin(req) {
    const user = await userModel.findById(req.userID).select("role");
    appAssert(user && user.role === "admin", FORBIDDEN, "Unable to complete request.");
}
