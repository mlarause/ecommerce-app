import { Request, Response } from 'express';
import Subcategory from '../models/Subcategory';
import Category from '../models/Category';

export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const subcategories = await Subcategory.find().populate('category');
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubcategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const subcategories = await Subcategory.find({ category: req.params.categoryId }).populate('category');
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;
    
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category does not exist' });
    }
    
    const subcategory = new Subcategory({ name, description, category });
    await subcategory.save();
    
    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    ).populate('category');
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    res.json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete subcategories' });
    }
    
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};