import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTRENAL_SERVER_ERROR,
} from "../constants/httpStatus";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generateToken";

export const registerUser = async (req: Request, res: Response) => {
  // GET REQUEST FROM BODY
  const { firstName, lastName, email, password } = req.body;

  try {
    // VALIDATE ALL FIELDS
    if (!firstName || !lastName || !email || !password) {
      return res.status(FORBIDDEN).json({ message: "All fields required" });
    }

    // check password length
    if (password.length < 8) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters" });
    }

    // check for existing user with email
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res
        .status(BAD_REQUEST)
        .json({ message: "User already exists with this email" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate token for the user
      generateToken(newUser._id, res);
      // save to db
      await newUser.save();
      //   return a response
      res
        .status(CREATED)
        .json({ success: true, message: "User Created Successfully", newUser });
    } else {
      res
        .status(BAD_REQUEST)
        .json({ success: false, message: "Error creating user" });
    }
  } catch (error) {
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};

export const loginUser = (req: Request, res: Response) => {};

export const logoutUser = (req: Request, res: Response) => {};
