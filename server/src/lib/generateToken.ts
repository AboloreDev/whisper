import { strict } from "assert";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: any, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "2d",
  });

  res.cookie("token", token, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
