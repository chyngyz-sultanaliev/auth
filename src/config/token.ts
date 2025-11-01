import jwt from "jsonwebtoken";

const generateToken = (userId: number, userEmail: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET не задан в .env");
  }

  return jwt.sign({ id: userId, email: userEmail }, secret, {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET не задан в .env");
  }

  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

export default {
  generateToken,
  verifyToken,
};
