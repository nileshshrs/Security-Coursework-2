import assert from "node:assert";
import { AppError } from "./AppError.js";

const appAssert = (condition, httpStatusCode, message, errorCode) => {
  try {
    assert(condition);
  } catch {
    throw new AppError(httpStatusCode, message, errorCode);
  }
};

export default appAssert;
