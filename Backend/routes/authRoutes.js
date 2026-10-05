import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from "../controllers/authControllers.js";

import { protectRoute } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me",protectRoute, getCurrentUser);

export default router;