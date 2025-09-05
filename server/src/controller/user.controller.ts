import { Request, Response } from "express";
import { INTRENAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/httpStatus";
import cloudinary from "../lib/cloudinaryConfig";
import User from "../models/UserModel";

export const getUserProfile = (req: Request, res: Response) => {
  try {
    res.status(OK).json(req.user);
  } catch (error) {
    console.log("Error getting user profile", error);
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Profile picture not found" });
    }

    const uploadHandler = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadHandler.secure_url,
      },
      { new: true }
    );
    res.status(OK).json(updatedUser);
  } catch (error) {
    console.log("Error Updating Profile", error);
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};
