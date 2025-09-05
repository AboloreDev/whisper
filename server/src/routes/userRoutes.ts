import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controller/user.controller";
import { isAuthenticated } from "../middleware/authMiddlware";

const router = express.Router();

// authenticate user
router.get("/", isAuthenticated, getUserProfile);
// update user profile
router.put("/update-profile", isAuthenticated, updateUserProfile);

export default router;
