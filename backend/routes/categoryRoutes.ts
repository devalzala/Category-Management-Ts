import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  searchCategory,
  getCategoryById,
} from "../controllers/categoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Category Routes
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getCategoryById);
router.post("/searchcategory", authMiddleware, searchCategory);

export default router;