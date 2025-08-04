"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const category = new Category_1.default(req.body);
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete categories' });
        }
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCategory = deleteCategory;
