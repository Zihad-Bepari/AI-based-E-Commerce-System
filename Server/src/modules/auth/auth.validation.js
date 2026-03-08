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