import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { registerService, loginService } from "./auth.service.js";
import { generateToken } from "../../utils/jwtToken.js";

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