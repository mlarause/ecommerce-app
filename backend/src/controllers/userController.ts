import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const createUser = async (req: Request<{}, {}, Omit<IUser, 'id'>>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Validación de email existente
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validación de rol
    if (!['admin', 'coordinator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Retornar usuario sin password
    const userToReturn = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json(userToReturn);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

export const updateUser = async (req: Request<{ id: string }, {}, Partial<IUser>>, res: Response) => {
  try {
    const { name, email, role, password } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) {
      if (!['admin', 'coordinator'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
      user.role = role;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Retornar usuario actualizado sin password
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Verificar rol de admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Unauthorized: Only admin users can delete users' 
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User deleted successfully',
      deletedUserId: deletedUser._id 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Método para comparar passwords (debe estar en el modelo User)
declare module '../models/User' {
  interface IUser {
    comparePassword(password: string): Promise<boolean>;
  }
}