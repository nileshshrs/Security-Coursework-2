import SessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js"
import verificationCodeModel from "../models/verification.model.js";
import appAssert from "../utils/appAssert.js";
import { hash } from "../utils/bcrypt.js";
import { APP_ORIGIN } from "../utils/constants/env.js";
import { CONFLICT, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from "../utils/constants/http.js";
import { fifteenDaysFromNow, fiveMinutesAgo, fiveMinutesFromNow, oneDayFromNow, oneHourFromNow } from "../utils/date.js";
import { getMfaCodeTemplate, getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailtemplate.js";
import { accessTokenSignOptions, refreshTokenSignOptions, signTokens, verifyToken } from "../utils/jwt.js";
import { sendMail } from "../utils/sendMail.js";

export const createAccount = async (data) => {
  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email: data.email }, { username: data.username }],
  });
  appAssert(!existingUser, CONFLICT, "Email or username already in use.");

  // Create user
  const user = await userModel.create({
    email: data.email,
    username: data.username,
    password: data.password,
  });

  // Create email verification code
  const verificationCode = await verificationCodeModel.create({
    userID: user._id,
    type: "email_verification",
    expiresAt: oneDayFromNow(),
  });

  // Generate verification URL
  const url = `${APP_ORIGIN}/email-verification/${verificationCode._id}`;

  // Send verification email
  const { subject, html, text } = getVerifyEmailTemplate({ username: user.username, url });
  const { error } = await sendMail({
    to: user.email,
    subject,
    html,
    text,
  });

  if (error) console.error("Verification email failed to send:", error);

  // Create session
  const session = await SessionModel.create({
    userID: user._id,
    userAgent: data.userAgent,
  });

  // Sign refresh and access tokens
  const refreshToken = signTokens({ sessionID: session._id }, refreshTokenSignOptions);
  const accessToken = signTokens({ userID: user._id, sessionID: session._id }, accessTokenSignOptions);

  // Return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};


export const login = async ({ usernameOrEmail, password, userAgent }) => {
  const user = await userModel.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
  });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  if (user.mfaEnabled) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await verificationCodeModel.create({
      userID: user._id,
      type: "mfa",
      code,
      expiresAt: fiveMinutesFromNow(),
    });

    const { subject, html, text } = getMfaCodeTemplate({
      username: user.username,
      code,
    });

    const { error } = await sendMail({
      to: user.email,
      subject,
      html,
      text,
    });

    if (error) console.error("MFA email failed to send:", error);

    return {
      requiresMFA: true,
      userID: user._id,
      message: "MFA code sent to your email.",
    };
  } else {
    const session = await SessionModel.create({ userID: user._id, userAgent });
    const refreshToken = signTokens({ sessionID: session._id }, refreshTokenSignOptions);
    const accessToken = signTokens({ sessionID: session._id, userID: user._id }, accessTokenSignOptions);

    return {
      user: user.omitPassword(),
      accessToken,
      refreshToken,
    };
  }
};




export const refreshUserAccessToken = async (refreshToken) => {
  const { payload } = verifyToken(refreshToken)


  appAssert(payload, UNAUTHORIZED, "invalid refresh token.")

  const session = await SessionModel.findById(payload.sessionID)
  const now = Date.now()
  appAssert(session
    && session.expiresAt.getTime() > now
    , UNAUTHORIZED, "session has expired.")

  // refresh session if it expires within next 24hrs

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= oneDayFromNow;

  if (sessionNeedsRefresh) {
    session.expiresAt = fifteenDaysFromNow();
    await session.save()
  }
  const newRefreshToken = sessionNeedsRefresh ? signTokens({
    sessionID: session._id, refreshTokenSignOptions
  }) : ""


  const accessToken = signTokens({
    userID: session.userID,
    sessionID: session._id
  })

  return {
    accessToken, newRefreshToken
  }

}

export const sendPasswordResetEmail = async (email) => {
  // Get the user by email
  const user = await userModel.findOne({ email: email });

  appAssert(user, NOT_FOUND, "User not found.");

  // Check email rate limit: max 1 request within the last 5 minutes
  const fiveMinAgo = fiveMinutesAgo();

  const count = await verificationCodeModel.countDocuments({
    userID: user._id,
    type: "password_reset",
    expiresAt: { $gt: fiveMinAgo },
  });

  appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many requests, please try again later.");

  // Create a verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await verificationCodeModel.create({
    userID: user._id,
    type: "password_reset",
    expiresAt,
  });

  // Construct the reset URL
  const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;

  console.log("Password reset URL:", url);

  // Send the password reset email
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });

  if (error) console.log(error);

  return {
    url,
    emailId: data.id, // Return the email ID from the sent email for logging or tracking purposes
  };
};

export const resetPassword = async ({ password, verificationCode }) => {
  //get verification code;
  const validCode = await verificationCodeModel.findOne({
    _id: verificationCode,
    type: "password_reset",
    expiresAt: { $gt: new Date() },
  })
  appAssert(validCode, NOT_FOUND, "invalid or expired verification code.");
  //update user password

  const updatedUser = await userModel.findByIdAndUpdate(
    validCode.userID, // The user's ID from the verification code
    { password: await hash(password) }, // Update the 'password' field
    { new: true } // Ensure that the updated document is returned
  );

  appAssert(updatedUser, NOT_FOUND, "failed to reset password");
  //delete verification code
  await verificationCodeModel.deleteMany({
    userID: validCode.userID,
    type: "password_reset",
  });

  //delete all sessions
  await SessionModel.deleteMany({
    userID: validCode.userID,
  });

  return {
    user: updatedUser.omitPassword()
  }
}

export const verifyEmail = async (code) => {
  //get the verificationc code

  const validCode = await verificationCodeModel.findOne({
    _id: code,
    type: "email_verification",
    expiresAt: { $gt: new Date() },
  })

  appAssert(validCode, NOT_FOUND, "invalid or expired verification code.");



  //get user by id & update user to verified = true
  const updatedUser = await userModel.findByIdAndUpdate(
    validCode.userID, // The user's ID from the verification code
    { verified: true }, // Update the 'verified' field to true
    { new: true } // Ensure that the updated document is returned
  );


  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "failed to verify user.")
  //delete verification code
  await verificationCodeModel.deleteMany({
    userID: validCode.userID,
    type: "email_verification",
  });
  return {
    user: updatedUser.omitPassword()
  }
}


export const verifyMfaCode = async ({ code, userAgent }) => {
  const validCode = await verificationCodeModel.findOne({
    code,
    type: "mfa",
    expiresAt: { $gt: new Date() }
  });

  appAssert(validCode, UNAUTHORIZED, "Invalid or expired MFA code.");

  const userID = validCode.userID;

  await verificationCodeModel.deleteMany({ userID, type: "mfa" });

  const session = await SessionModel.create({ userID, userAgent });

  const refreshToken = signTokens({ sessionID: session._id }, refreshTokenSignOptions);
  const accessToken = signTokens({ sessionID: session._id, userID }, accessTokenSignOptions);

  const user = await userModel.findById(userID);
  appAssert(user, UNAUTHORIZED, "User not found during MFA verification");

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};