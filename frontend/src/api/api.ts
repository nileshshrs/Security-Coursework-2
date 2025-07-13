import API from "./apiClient";

export const sendPasswordResetEmail = async (email: string): Promise<any> => {
  try {
    const res = await API.post("/auth/account-recovery", { email });
    return res; // It includes: message, resetUrl, emailId
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async ({
  password,
  verificationCode,
}: {
  password: string;
  verificationCode: string;
}): Promise<any> => {
  try {
    const res = await API.post("/auth/reset-password", { password, verificationCode });
    return res; // contains: { message: "password reset successful." }
  } catch (error) {
    throw error;
  }
};