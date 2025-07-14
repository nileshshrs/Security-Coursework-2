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
  email: Joi.string().email().trim().required(),
  username: safeString("Username").trim().min(3).max(30).required(),
  password: safeString("Password").min(8).max(64).required(),
  userAgent: Joi.string().trim().max(256).optional(),
}).unknown(false);

export const loginSchema = Joi.object({
  usernameOrEmail: safeString("Username or Email").trim().required(),
  password: safeString("Password").required(),
  userAgent: Joi.string().trim().max(256).optional(),
}).unknown(false);

export const verifyEmailSchema = Joi.object({
  code: Joi.string().length(24).hex().required(),
}).unknown(false);

export const passwordResetSchema = Joi.object({
  password: safeString("Password").min(8).max(64).required(),
  verificationCode: Joi.string().length(24).hex().required(),
}).unknown(false);

export const sendPasswordResetSchema = Joi.object({
  email: Joi.string().email().trim().required(),
}).unknown(false);

export const refreshTokenSchema = Joi.object({
  refreshToken: safeString("Refresh Token").required(),
}).unknown(false);

export const mfaCodeSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/).required(),
}).unknown(false);


export const createClothesSchema = Joi.object({
  name: safeString("Name").trim().min(1).max(255).required(),
  category: Joi.string()
    .valid("Male", "Female", "Unisex", "Other")
    .required(),
  type: safeString("Type").trim().min(1).max(100).required(),
  size: Joi.array()
    .items(safeString("Size").trim().min(1).max(20))
    .min(1)
    .required(),
  color: Joi.array()
    .items(safeString("Color").trim().min(1).max(30))
    .min(1)
    .required(),
  price: Joi.number().greater(0).precision(2).required(), // price must be > 0
  inStock: Joi.boolean().optional(),
  bestseller: Joi.boolean().optional(),
  newArrival: Joi.boolean().optional(),
  imagePath: safeString("Image Path").trim().max(5000).optional().allow(""),
  description: safeString("Description").trim().max(10000).optional().allow(""),
}).unknown(false); // Disallow extra fields


export const updateClothesSchema = Joi.object({
  name: safeString("Name").trim().min(1).max(255).optional(),
  category: Joi.string()
    .valid("Male", "Female", "Unisex", "Other")
    .optional(),
  type: safeString("Type").trim().min(1).max(100).optional(),
  size: Joi.array().items(safeString("Size").trim().min(1).max(20)).min(1).unique().optional(),
  color: Joi.array().items(safeString("Color").trim().min(1).max(30)).min(1).unique().optional(),
  price: Joi.number().greater(0).precision(2).optional(),
  inStock: Joi.boolean().strict().optional(),
  bestseller: Joi.boolean().strict().optional(),
  newArrival: Joi.boolean().optional(),
  imagePath: safeString("Image Path").trim().max(5000).optional().allow(""),
  description: safeString("Description").trim().max(10000).optional().allow(""),
}).min(1).unknown(false);

//this is for clothing but it can be used in multiple places
export const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});