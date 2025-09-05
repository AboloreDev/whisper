import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  BAD_REQUEST,
  INTRENAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/httpStatus";
import User from "../models/UserModel";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: typeof User.prototype;
    }
  }
}

// Interface for JWT payload
interface JwtPayload {
  userId: string;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    console.log("Token Received", token);

    if (!token) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Unauthorized User, No token provided" });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    console.log("Decoded Id:", decoded.userId);
    if (!decoded || !decoded.userId) {
      return res.status(BAD_REQUEST).json({ message: "Invalid token" });
    }

    // FIND USER
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};
