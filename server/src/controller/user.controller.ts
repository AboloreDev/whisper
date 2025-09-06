import { Request, Response } from "express";
import {
  BAD_REQUEST,
  INTRENAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../constants/httpStatus";
import User from "../models/UserModel";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Make sure dotenv is loaded first
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    // Check if user exists in request (from auth middleware)
    if (!req.user || !req.user._id) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "User not authenticated" });
    }

    const userId = req.user._id;

    // Check if file was uploaded through multer
    if (!req.file) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Profile picture is required" });
    }

    // Debug: Log file information
    console.log("File info:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Convert buffer to base64 for Cloudinary upload
    const base64String = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64String}`;

    // Debug: Log first 100 characters of dataURI
    console.log("DataURI preview:", dataURI.substring(0, 100) + "...");

    // Upload to Cloudinary with error handling
    let uploadHandler;
    try {
      uploadHandler = await cloudinary.uploader.upload(dataURI, {
        folder: "profile_pictures",
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
        ],
      });

      console.log("Cloudinary upload successful:", uploadHandler.secure_url);
    } catch (cloudinaryError: any) {
      console.log("Detailed Cloudinary error:", {
        message: cloudinaryError.message,
        error: cloudinaryError.error,
        http_code: cloudinaryError.http_code,
      });

      return res.status(BAD_REQUEST).json({
        message: "Failed to upload image to cloud storage",
        error: cloudinaryError.message,
      });
    }

    // Update user profile in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadHandler.secure_url,
      },
      { new: true, select: "-password" }
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    res.status(OK).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error: any) {
    console.log("Error updating profile:", error);

    // Handle multer errors specifically
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(BAD_REQUEST)
        .json({ message: "File too large. Maximum size is 5MB" });
    }

    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
