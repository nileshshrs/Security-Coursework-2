// controllers/clothes.controller.js
import Clothes from "../models/clothes.model.js";
import appAssert from "../utils/appAssert.js";
import assertAdmin from "../utils/assertAdmin.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, NOT_FOUND, OK } from "../utils/constants/http.js";

export const createClothesController = catchErrors(async (req, res) => {
    await assertAdmin(req);

    const { name, category, size, color, price, ...rest } = req.body;

    appAssert(name, 400, "Name is required.");
    appAssert(category, 400, "Category is required.");
    appAssert(Array.isArray(size) && size.length > 0, 400, "At least one size is required.");
    appAssert(Array.isArray(color) && color.length > 0, 400, "At least one color is required.");
    appAssert(price, 400, "Price is required.");

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
        clothes: clothing,
    });
});

// UPDATE
export const updateClothesController = catchErrors(async (req, res) => {
    await assertAdmin(req);

    const { id } = req.params;
    const updates = { ...req.body };

    if ("_id" in updates) delete updates._id;

    const clothing = await Clothes.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    appAssert(clothing, NOT_FOUND, "Clothing item not found.");

    return res.status(OK).json({
        message: "Clothing item updated successfully.",
        clothes: clothing,
    });
});

// DELETE
export const deleteClothesController = catchErrors(async (req, res) => {
    await assertAdmin(req);

    const { id } = req.params;

    const clothing = await Clothes.findByIdAndDelete(id);

    appAssert(clothing, NOT_FOUND, "Clothing item not found.");

    return res.status(OK).json({
        message: "Clothing item deleted successfully.",
    });
});

// READ (no admin check needed)
export const getClothesByIdController = catchErrors(async (req, res) => {
    const { id } = req.params;
    const clothing = await Clothes.findById(id);
    appAssert(clothing, NOT_FOUND, "Clothing item not found.");
    return res.status(OK).json({
        message: "Clothing item fetched successfully.",
        clothing,
    });
});

export const getAllClothesController = catchErrors(async (req, res) => {
    const clothes = await Clothes.find();
    return res.status(OK).json({
        message: "All clothing items fetched successfully.",
        clothes,
    });
});