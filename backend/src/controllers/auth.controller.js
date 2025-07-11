
import SessionModel from "../models/session.model.js";
import {
    createAccount,
    login,
    refreshUserAccessToken,
    resetPassword,
    sendPasswordResetEmail,
    verifyEmail,
    verifyMfaCode
} from "../service/auth.service.js";
import appAssert from "../utils/appAssert.js";
import catchErrors from "../utils/catchErrors.js";
import { CREATED, OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from "../utils/constants/http.js";
import {
    clearAuthCookies,
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies
} from "../utils/cookies.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const registerController = catchErrors(async (req, res) => {
    const request = {
        ...req.body,
        userAgent: req.headers["user-agent"],
    };

    const { user, accessToken, refreshToken } = await createAccount(request);

    return setAuthCookies(res, accessToken, refreshToken).status(CREATED).json({
        user,
        message: "sucessfully registered."
    });
});

export const loginController = catchErrors(async (req, res) => {
    const request = {
        ...req.body,
        userAgent: req.headers["user-agent"],
    };

    const result = await login(request);

    if (result.requiresMFA) {
        // Don't set cookies, don't log user in, just prompt for MFA code
        return res.status(200).json({
            message: result.message,
            requiresMFA: true,
            userID: result.userID,
        });
    }

    // Only here if login succeeded and no MFA is required
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return res.status(OK).json({
        message: "successfully logged in.",
        user: result.user,
    });
});
export const logoutController = catchErrors(async (req, res) => {
    const accessToken = req.cookies.access_token;
    const { payload } = verifyAccessToken(accessToken || "");

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionID);
    }

    return clearAuthCookies(res).status(OK).json({
        message: "user logged out successfully."
    });
});

export const refreshController = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    appAssert(refreshToken, UNAUTHORIZED, "missing refresh token.");

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

    const resWithAccess = res.cookie("access_token", accessToken, getAccessTokenCookieOptions());
    if (newRefreshToken) {
        resWithAccess.cookie("refresh_token", newRefreshToken, getRefreshTokenCookieOptions());
    }

    return resWithAccess.status(OK).json({
        message: "access token has been refreshed."
    });
});

export const sendPasswordResetController = catchErrors(async (req, res) => {
    const Email = req.body.email;
    const { url, emailId } = await sendPasswordResetEmail(Email);

    res.status(200).json({
        message: "Password reset email sent.",
        resetUrl: url,
        emailId
    });
});

export const resetPasswordController = catchErrors(async (req, res) => {
    const request = req.body;
    await resetPassword(request);

    return clearAuthCookies(res).status(OK).json({
        message: "password reset successful."
    });
});


export const verifyEmailController = catchErrors(
    async (req, res) => {
        const verificationCode = req.params.code;
        await verifyEmail(verificationCode);

        return res.status(OK).json({
            message: "Email verification successful."
        });
    }
);

export const verifyMfaController = catchErrors(async (req, res) => {
    const { code } = req.body;
    const userAgent = req.headers["user-agent"];

    const { accessToken, refreshToken, user } = await verifyMfaCode({ code, userAgent });

    setAuthCookies(res, accessToken, refreshToken);
    return res.status(OK).json({
        message: "MFA verification successful.",
        user,
    });
});
