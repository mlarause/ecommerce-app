// Guarda como reset-admin.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-app')
  .then(async () => {
    console.log('Conectado a MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String, email: String, password: String, role: String
    }));
    
    const admin = await User.findOne({email: 'admin@example.com'});
    if (!admin) {
      console.log('Admin no encontrado');
      return mongoose.disconnect();
    }
    
    // Nueva contraseña simple para probar
    const plainPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('Contraseña actualizada a:', plainPassword);
    console.log('Hash:', hashedPassword);
    
    mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err));