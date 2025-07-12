import { AppError } from "../utils/AppError.js";
import { INTERNAL_SERVER_ERROR } from "../utils/constants/http.js";
import { clearAuthCookies, refresh_path } from "../utils/cookies.js";

const handleAppError = (res, error) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode || null,
  });
};

const error = (err, req, res, next) => {
  try {
    if (req.path === refresh_path) {
      clearAuthCookies(res);
    }

    if (err instanceof AppError) {
      return handleAppError(res, err);
    }

    console.error(`Unhandled Error @ ${req.path}:`, err);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  } catch (handlerError) {
    console.error("Critical Error in error middleware:", handlerError);
    return res.status(500).json({ message: "Critical server error." });
  }
};

export default error;
