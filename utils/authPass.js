import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validatePassword = (password) => {
  // Check if password is at least 8 characters long
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  // Check if password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  // Check if password contains at least one number
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  // Check if password contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null; // Password is valid
};

// Validate the user is admin email or others
export const verifyUserEmail = (userType) => {
  // Example validation: check if email ends with '@admin.com'
  if (userType === 'admin') {
    return true;
  }
  return null; // Email is valid
};