import express from "express";
import { isAuthenticated } from "../middleware/authMiddlware";
import {
  fetchChatMessages,
  getAllChats,
  sendMessages,
} from "../controller/message.controller";

const router = express.Router();

// FETCH ALL CHATS FOR THE USER
router.get("/chats", isAuthenticated, getAllChats);

// Get user messages for each chats
router.get(":id/messages", isAuthenticated, fetchChatMessages);

// send messages
router.post("/send/:id", isAuthenticated, sendMessages);
export default router;
