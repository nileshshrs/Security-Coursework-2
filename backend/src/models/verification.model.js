import mongoose from "mongoose";

const VerificationCodeSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["email_verification", "password_reset", "mfa"],
  },
  code: {
    type: String,
    required: function () {
      // 'code' is required only for MFA type
      return this.type === "mfa";
    },
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const verificationCodeModel = mongoose.model(
  "VerificationCode",
  VerificationCodeSchema,
  "verification_codes"
);

export default verificationCodeModel;
