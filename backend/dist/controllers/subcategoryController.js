"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory = exports.updateSubcategory = exports.createSubcategory = exports.getSubcategoriesByCategory = exports.getSubcategories = void 0;
const Subcategory_1 = __importDefault(require("../models/Subcategory"));
const Category_1 = __importDefault(require("../models/Category"));
const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory_1.default.find().populate('category');
        res.json(subcategories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener subcategorías' });
    }
};
exports.getSubcategories = getSubcategories;
const getSubcategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory_1.default.find({ category: req.params.categoryId }).populate('category');
        res.json(subcategories);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSubcategoriesByCategory = getSubcategoriesByCategory;
const createSubcategory = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const categoryExists = await Category_1.default.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Category does not exist' });
        }
        const subcategory = new Subcategory_1.default({ name, description, category });
        await subcategory.save();
        res.status(201).json(subcategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createSubcategory = createSubcategory;
const updateSubcategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const subcategory = await Subcategory_1.default.findByIdAndUpdate(req.params.id, { name, description }, { new: true }).populate('category');
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subcategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateSubcategory = updateSubcategory;
const deleteSubcategory = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete subcategories' });
        }
        const subcategory = await Subcategory_1.default.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json({ message: 'Subcategory deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteSubcategory = deleteSubcategory;
