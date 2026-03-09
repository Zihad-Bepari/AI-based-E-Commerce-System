import express from 'express';
import { registerUser, loginUser , logoutUser , getProfile, forgotPassword,resetPassword, updatePassword  } from './authController.js';
import { registerValidation, loginValidation, validateResetPassword,validateUpdatePassword } from './auth.validation.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
const router = express.Router();

router.post("/register",registerValidation, registerUser); 
router.post("/login", loginValidation, loginUser);
router.get("/profile", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logoutUser);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", validateResetPassword, resetPassword);
router.put("/update", isAuthenticated, validateUpdatePassword, updatePassword);

export default router;