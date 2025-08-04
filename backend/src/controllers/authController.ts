// Versión con logs de depuración
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middlewares/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const login = async (req: Request<{}, {}, { email: string; password: string }>, res: Response) => {
  console.log('🚀 REQUEST RECIBIDA EN /login', req.body);
  try {
    // Depuración básica
    if (!req.body) {
      console.log('❌ Body vacío');
      return res.status(400).json({ message: 'Body vacío' });
    }
    
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('❌ Faltan campos:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    
    console.log('🔍 Intento de login con:', { email, passwordLength: password?.length || 0 });
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Usuario no encontrado en la base de datos');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Usuario encontrado:', { 
      id: user._id,
      email: user.email,
      role: user.role,
      passwordHash: user.password.substring(0, 20) + '...'
    });
    
    // Prueba directa de comparación
    console.log('🔐 Comparando contraseñas:');
    console.log('- Contraseña ingresada:', password);
    console.log('- Hash almacenado:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Resultado de comparación de contraseñas:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Autenticación exitosa, generando token');
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('🎫 Token generado exitosamente');
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cambiar Request por AuthenticatedRequest para que TypeScript reconozca req.user
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id; // Ahora TypeScript sabe que user existe y tiene id
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};