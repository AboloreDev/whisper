import { Request, Response } from "express";
import User from "../models/UserModel";
import { INTRENAL_SERVER_ERROR, OK } from "../constants/httpStatus";
import Message from "../models/MessageModel";
import cloudinary from "../lib/cloudinaryConfig";

export const getAllChats = async (req: Request, res: Response) => {
  try {
    // get the loggedin user id
    const loggedInUserId = req.user._id;

    // fetch all chats for this user
    const filteredChats = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(OK).json(filteredChats);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};

export const fetchChatMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: id },
        { senderId: id, receiverId: myId },
      ],
    });

    res.status(OK).json(messages);
  } catch (error) {
    console.log("Can't retrieve message", error);
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};

export const sendMessages = async (req: Request, res: Response) => {
  const { id: receiverId } = req.params;
  const { text, image, emoji } = req.body;
  try {
    const myId = req.user._id;

    let imageUrl;

    if (image) {
      // upload to cloudinary
      const uploadHandler = await cloudinary.uploader.upload(image);
      imageUrl = uploadHandler.secure_url;
    }

    // create new message
    const newMessage = new Message({
      myId,
      receiverId,
      text,
      image: imageUrl,
      emoji,
    });

    await newMessage.save();

    // real time finctionality ==> socket.io

    res.status(OK).json(newMessage);
  } catch (error) {
    console.log("Error sending message", error);
    return res
      .status(INTRENAL_SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
};
