import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { registerService, loginService, forgotPasswordService, resetUserPassword , updateUserPassword} from "./auth.service.js";
import { generateToken } from "../../utils/jwtToken.js";
import { sendToken } from "../../utils/sendToken.js";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../../middlewares/errorMiddlleware.js";



export const registerUser = catchAsyncError(async (req, res, next) => {
    const user = await registerService(req.body,res,next);
    
    generateToken(user, 201, "User registered successfully", res);

});

export const loginUser = catchAsyncError(async (req, res, next) => {
    const user = await loginService(req.body,res,next);

    generateToken(user, 200, "User logged in successfully", res);
});

export const getProfile = catchAsyncError(async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user
    });
});

export const logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "User logged out successfully"
    });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const { frontendUrl } = req.query;

    const result = await forgotPasswordService(email, frontendUrl);

    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(result.message === "User not found with this email" ? 404 : 500).json(result);
    }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await resetUserPassword(token, password);
    sendToken(user, 200, "Password reset successfully", res);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  await updateUserPassword(req.user, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { error } = updateProfileValidation.validate(req.body);

    if (error) {
        return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { name, email } = req.body;

    let imageData = null;

    if (req.file) {

        if (req.user.profile_image_url?.public_id) {
            await cloudinary.v2.uploader.destroy(req.user.profile_image_url.public_id);
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "profile_images",
            width: 150,
            crop: "scale",
        });

        imageData = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    const user = await updateUserProfileService(
        name,
        email,
        imageData,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });

});