"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Rutas de usuarios
router.get('/', auth_1.auth, auth_1.adminOnly, userController_1.getUsers); // Solo admin puede listar usuarios
router.get('/:id', auth_1.auth, auth_1.adminOnly, userController_1.getUserById); // Solo admin puede ver usuario específico
router.post('/', auth_1.auth, auth_1.adminOnly, userController_1.createUser); // Solo admin puede crear usuarios
router.put('/:id', auth_1.auth, auth_1.adminOnly, userController_1.updateUser); // Solo admin puede actualizar usuarios
router.delete('/:id', auth_1.auth, auth_1.adminOnly, userController_1.deleteUser); // Solo admin puede eliminar usuarios
exports.default = router;
