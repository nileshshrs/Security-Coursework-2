import mongoose from "mongoose";

// Define the allowed categories (matching the Java enum)
const CATEGORY = ['Male', 'Female', 'Unisex', 'Other'];

// The main schema
const clothesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: CATEGORY,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    size: {
        type: [String],
        required: true,
    },
    color: {
        type: [String],
        required: true,
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },
    bestseller: {
        type: Boolean,
        required: true,
        default: false,
    },
    newArrival: { // changed from isNew
        type: Boolean,
        required: true,
        default: false,
    },
    imagePath: {
        type: String,
        maxlength: 5000,
    },
    description: {
        type: String,
        maxlength: 10000,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
});

// Virtual for price as float (optional)
clothesSchema.virtual('priceFloat').get(function () {
    return parseFloat(this.price.toString());
});

// Export the model as default
const Clothes = mongoose.model('Clothes', clothesSchema);
export default Clothes;
