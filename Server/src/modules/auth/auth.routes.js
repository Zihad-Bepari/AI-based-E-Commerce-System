import express from 'express';
import { registerUser, loginUser , logoutUser , getProfile  } from './authController.js';
import { registerValidation, loginValidation  } from './auth.validation.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
const router = express.Router();

router.post("/register",registerValidation, registerUser); 
router.post("/login", loginValidation, loginUser);
router.get("/profile", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logoutUser);
export default router;