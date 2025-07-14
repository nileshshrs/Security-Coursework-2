import { uploadToCloudinary } from "../service/upload.service.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { BAD_REQUEST, OK } from "../utils/constants/http.js";
import { fileTypeFromBuffer } from "file-type";

export const uploadImageController = catchErrors(async (req, res) => {
    const file = req.file;
    appAssert(file, BAD_REQUEST, "No image file uploaded.");

    // Use file-type to check actual file signature, not just mimetype
    const detectedType = await fileTypeFromBuffer(file.buffer);
    appAssert(
        detectedType && detectedType.mime.startsWith("image/"),
        BAD_REQUEST,
        "Uploaded file is not a valid image."
    );

    const result = await uploadToCloudinary(
        file.buffer,
        "rhythm-player/images",
        "image"
    );

    return res.status(OK).json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        public_id: result.public_id,
    });
});
