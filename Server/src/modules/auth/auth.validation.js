import ErrorHandler from "../../middlewares/errorMiddlleware.js";

export const registerValidation = (req, res, next) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide name, email and password", 400));
    }

    next();
};

export const loginValidation = (req, res, next) => {

    const { email, password } = req.body;   
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }   
    next();
}


export const validateResetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  // Check if both fields exist
  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Both password and confirmPassword are required",
    });
  }

  // Check if they match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirm password do not match",
    });
  }

  // Check length
  if (password.length < 6 || password.length > 20) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 6 and 20 characters",
    });
  }

  // All good
  next();
};

export const validateUpdatePassword = (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current password, new password and confirm password",
    });
  }

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json({
      success: false,
      message: "New password must be between 6 and 20 characters",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }

  next();
};