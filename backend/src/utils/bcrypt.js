import bcrypt from 'bcrypt';

// Corrected: return the hash result
export const hash = async (value, salt = 10) => {
  return await bcrypt.hash(value, salt);
};

// Corrected: return the compare result, with a fallback
export const compare = async (value, hashedValue) => {
  try {
    return await bcrypt.compare(value, hashedValue);
  } catch {
    return false;
  }
};