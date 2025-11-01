import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      iat?: number;
      exp?: number;
    };
  }
}

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET не задан в .env");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Неверный или просроченный токен",
      error: (error as Error).message,
    });
  }
};
