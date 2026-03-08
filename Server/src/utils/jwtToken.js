import jwt from "jsonwebtoken";

export const generateToken = (user,statuscode,message,res) => {
    if (!user || !user.id) throw new Error("User ID missing for token");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(statuscode).cookie("token", token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }).json({
        success: true,
        user,
        message,
        token,
    })
 
}     