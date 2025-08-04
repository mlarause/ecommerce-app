import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

// Extender la interfaz Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// Tipo para peticiones autenticadas 
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware de autenticación
export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded as { id: string; email: string; role: string };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

// Middleware para roles específicos
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo para administradores' });
  }
  next();
};

// Middleware para asegurar la conversión de tipo
export const withAuthUser = (handler: (req: AuthenticatedRequest, res: Response, next?: NextFunction) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // En este punto, auth ya ha añadido req.user, podemos hacer la conversión de tipo
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    
    // El handler recibe req como AuthenticatedRequest
    return handler(req as AuthenticatedRequest, res, next);
  };
};