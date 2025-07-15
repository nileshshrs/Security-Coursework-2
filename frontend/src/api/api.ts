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

export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  // This will handle both: if the interceptor failed OR not
  return API.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((res: any) => {
    // If res.imageUrl exists, return it. If not, maybe it's an AxiosResponse (from a test, etc)
    if (res && typeof res === "object" && "imageUrl" in res) return res.imageUrl;
    if (res && res.data && "imageUrl" in res.data) return res.data.imageUrl;
    throw new Error("Unexpected response from uploadImage");
  });
};



export const createClothes = async (data: any): Promise<any> => {
  try {
    const res = await API.post("/clothes/create", data);
    return res;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateClothes = async ({ id, updates }: { id: string, updates: any }): Promise<any> => {
  try {
    const res = await API.patch(`/clothes/update/${id}`, updates);
    return res;
  } catch (error) {
    throw error;
  }
};

// DELETE
export const deleteClothes = async (id: string): Promise<any> => {
  try {
    const res = await API.delete(`/clothes/delete/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

// GET ALL
export const getAllClothes = async (): Promise<any> => {
  try {
    const res = await API.get("/clothes/get-all");
    return res;
  } catch (error) {
    throw error;
  }
};

// GET BY ID
export const getClothesById = async (id: string): Promise<any> => {
  try {
    const res = await API.get(`/clothes/get/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};