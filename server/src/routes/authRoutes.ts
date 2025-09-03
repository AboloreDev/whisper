import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/auth.controller";

const router = express.Router();

// register
router.post("/register", registerUser);
// login
router.post("/login", loginUser);
// Logout
router.post("/logout", logoutUser);

export default router;
