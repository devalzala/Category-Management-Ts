import express from "express";
import { login, register } from "../controllers/authController";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);

export default router