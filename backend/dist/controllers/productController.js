"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const Subcategory_1 = __importDefault(require("../models/Subcategory"));
const getProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find()
            .populate('category')
            .populate('subcategory');
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory } = req.body;
        const categoryExists = await Category_1.default.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Category does not exist' });
        }
        const subcategoryExists = await Subcategory_1.default.findById(subcategory);
        if (!subcategoryExists) {
            return res.status(400).json({ message: 'Subcategory does not exist' });
        }
        // Verify that subcategory belongs to category
        if (subcategoryExists.category.toString() !== category) {
            return res.status(400).json({ message: 'Subcategory does not belong to the specified category' });
        }
        const product = new Product_1.default({ name, description, price, category, subcategory });
        await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true }).populate('category').populate('subcategory');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete products' });
        }
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteProduct = deleteProduct;
