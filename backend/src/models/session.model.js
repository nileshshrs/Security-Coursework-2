import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date.js";

const sessionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        index: true,
    },
    userAgent: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: thirtyDaysFromNow,
    },
})

const SessionModel = mongoose.model("session", sessionSchema);
export default SessionModel;