import { Request, Response } from "express";
import mongoose from "mongoose";
import Category, { ICategory } from "../models/categoryModel";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, parentCategory } = req.body;

    if (!name) {
      res.status(400).json({ message: "Category name is required", success: false });
      return;
    }

    const category: ICategory = await Category.create({ name, parentCategory });

    res.status(201).json({ data: category, message: "Category created successfully", success: true });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false, error: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!name && !status) {
      res.status(400).json({ message: "Nothing to update", success: false });
      return;
    }

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found", success: false });
      return;
    }

    category.name = name || category.name;
    category.status = status || category.status;
    await category.save();

    if (category.parentCategory == null) {
      await Category.updateMany({ parentCategory: category._id }, { status: category.status });
    }

    res.status(200).json({ data: category, message: "Category updated successfully", success: true });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false, error: (error as Error).message });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not found", success: false });
      return;
    }

    await Category.findByIdAndDelete(id);

    if (category.parentCategory !== null) {
      await Category.updateMany({ parentCategory: category._id }, { parentCategory: category.parentCategory });
    }

    res.status(200).json({ message: "Category deleted successfully", success: true });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false, error: (error as Error).message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({}).populate("parentCategory").lean().exec();

    res.status(200).json({ data: categories, message: "Categories fetched successfully", success: true });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false, error: (error as Error).message });
  }
};

export const searchCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.body;
    const limit = 5;

    let findObject = {
      name: { $regex: search.trim(), $options: "i" },
    };

    const categories = await Category.find(findObject).sort({ createdAt: -1 }).limit(limit).lean().exec();

    res.status(200).json({
      success: true,
      data: categories,
      message: "Search results fetched successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Error searching category", success: false, error: (error as Error).message });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return; // Explicitly return to avoid further execution
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};