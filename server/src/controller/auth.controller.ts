import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  INTRENAL_SERVER_ERROR,
  OK,
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
      res.status(CREATED).json({
        success: true,
        message: "User Created Successfully",
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid email or password" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid email or password" });
    }

    //GENRATE TOKEN WHEN ALL IS CORRECT//
    generateToken(user._id, res);

    // SEND A RESPONSE
    res.status(OK).json({
      success: true,
      message: "User Logged in succesfully",
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // CLEAR OUT COOKIES ON LOGOUT
  try {
    res.cookie("token", "", { maxAge: 0 });
    res
      .status(OK)
      .json({ success: true, message: "User Logged out succesfully" });
  } catch (error) {
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};
