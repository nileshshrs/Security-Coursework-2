import Joi from "joi";

// Disallow MongoDB-style injection attempts
const mongoInjectionPattern = /^\s*\$[a-zA-Z0-9_]+/;

const safeString = (fieldName) =>
  Joi.string()
    .custom((value, helpers) => {
      if (typeof value !== "string" || mongoInjectionPattern.test(value)) {
        return helpers.message(`${fieldName} contains potentially dangerous input.`);
      }
      return value;
    })
    .messages({
      "string.base": `${fieldName} must be a string.`,
    });

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: safeString("Username").min(3).max(30).required(),
  password: safeString("Password").min(8).max(64).required(),
  userAgent: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  usernameOrEmail: safeString("Username or Email").required(),
  password: safeString("Password").required(),
  userAgent: Joi.string().optional(),
});

export const verifyEmailSchema = Joi.object({
  code: Joi.string().length(24).hex().required(),
});

export const passwordResetSchema = Joi.object({
  password: safeString("Password").min(8).max(64).required(),
  verificationCode: Joi.string().length(24).hex().required(),
});

export const sendPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: safeString("Refresh Token").required(),
});

export const mfaCodeSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
});
