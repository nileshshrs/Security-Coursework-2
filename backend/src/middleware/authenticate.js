import appAssert from "../utils/appAssert.js"
import { AppErrorCode } from "../utils/AppError.js"
import { UNAUTHORIZED } from "../utils/constants/http.js"
import { verifyAccessToken } from "../utils/jwt.js"

const authenticate = (req, res, next) => {
    const accessToken = req.cookies.access_token || undefined;

    appAssert(accessToken, UNAUTHORIZED, "No access token provided", AppErrorCode.InvalidAccessToken);

    const { error, payload } = verifyAccessToken(accessToken);

    appAssert(!error && payload, error === 'jwt expired' ? "Token Expired." : "Invalid token.", AppErrorCode.InvalidAccessToken);

    req.userID = payload.userID;
    req.sessionID = payload.sessionID;
    next();
};

export default authenticate;