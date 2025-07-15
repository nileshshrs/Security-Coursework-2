export type User = {
    _id: string;
    email: string;
    username: string;
    role?: string;
    image?: string;
    bio?: string;
    mfa?: boolean;
    verified?: boolean
    // Add more user fields here if you need
};

// --- Login Types ---
export type LoginRequest = {
    usernameOrEmail: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    user: User;
};

// --- AuthContext Shape ---
export type AuthContextType = {
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  mfa: { requiresMFA: boolean; userID: string; message: string } | null;
  verifyMfa: (data: { code: string }) => Promise<void>;
};


export type Clothes = {
  _id?: string; // MongoDB ObjectId as string (if present)
  name: string;
  category: "Male" | "Female" | "Unisex" | "Other";
  type: string;
  size: string[];        // Array of sizes
  color: string[];       // Array of colors
  price: { $numberDecimal: string } | string | number; // Mongoose Decimal128
  inStock: boolean;
  bestseller: boolean;
  newArrival: boolean;
  imagePath?: string;
  description?: string;
  createdAt?: string;    // ISO string
  updatedAt?: string;    // ISO string
  __v?: number;
};
