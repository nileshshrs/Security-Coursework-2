import { AppError } from "../utils/AppError.js";
import { BAD_REQUEST } from "../utils/constants/http.js";

export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const data = req[source];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const message = error.details
        .map((d) => d.message.replace(/["]/g, "")) // Clean output
        .join(", ");
      return next(new AppError(`Validation failed: ${message}`, BAD_REQUEST));
    }

    next();
  } catch (err) {
    next(new AppError("Server error during validation", BAD_REQUEST));
  }
};
