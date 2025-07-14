// controllers/clothes.controller.js
import Clothes from "../models/clothes.model.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED } from "../utils/constants/http.js";

// Create clothing item controller (POST /api/clothes)
export const createClothesController = catchErrors(async (req, res) => {
    const { name, category, size, color, price, ...rest } = req.body;

    appAssert(name, 400, "Name is required.");
    appAssert(category, 400, "Category is required.");
    appAssert(Array.isArray(size) && size.length > 0, 400, "At least one size is required.");
    appAssert(Array.isArray(color) && color.length > 0, 400, "At least one color is required.");
    appAssert(price, 400, "Price is required.");

    // All fields are valid; create document in DB
    const clothing = await Clothes.create({
        name,
        category,
        size,
        color,
        price,
        ...rest,
    });

    return res.status(CREATED).json({
        message: "Clothing item created successfully.",
        data: clothing,
    });
});
