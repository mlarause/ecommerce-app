"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
router.get('/me', auth_1.auth, authController_1.getCurrentUser);
exports.default = router;
