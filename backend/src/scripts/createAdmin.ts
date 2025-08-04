import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('El usuario admin ya existe');
      await mongoose.disconnect();
      return;
    }
    
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Crear el usuario admin
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,  // Ya está encriptado
      role: 'admin'
    });
    
    // Guardar sin activar el middleware
    await admin.save({ validateBeforeSave: false });
    console.log('Usuario admin creado exitosamente');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
    process.exit(1);
  }
};

createAdmin();