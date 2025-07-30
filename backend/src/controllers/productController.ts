import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import Subcategory from '../models/Subcategory';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('subcategory');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(400).json({ message: 'Subcategory does not exist' });
    }
    
    // Verify that subcategory belongs to category
    if (subcategoryExists.category.toString() !== category) {
      return res.status(400).json({ message: 'Subcategory does not belong to the specified category' });
    }
    
    const product = new Product({ name, description, price, category, subcategory });
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    ).populate('category').populate('subcategory');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete products' });
    }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};