"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { password, ...userData } = req.body;
        // Validación de email existente
        const existingUser = await User_1.default.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            ...userData,
            password: hashedPassword
        });
        await user.save();
        // No retornar password
        const userResponse = user.toObject();
        delete userResponse.password;
        res.status(201).json(userResponse);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        const update = { ...updateData };
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            update.password = await bcryptjs_1.default.hash(password, salt);
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};
exports.deleteUser = deleteUser;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUserById = getUserById;
