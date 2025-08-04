import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-app')
  .then(async () => {
    console.log('Conectado a MongoDB');
    
    // Buscar al usuario admin existente
    const User = mongoose.model('User', new mongoose.Schema({
      name: String, email: String, password: String, role: String
    }));
    
    const existingAdmin = await User.findOne({email: 'admin@example.com'});
    
    if (existingAdmin) {
      // Actualiza la contraseña del admin existente
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log('Contraseña de admin actualizada');
    } else {
      // Crea un nuevo admin si no existe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Usuario admin creado');
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });