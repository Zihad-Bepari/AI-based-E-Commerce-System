import database from "../../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ErrorHandler from "../../middlewares/errorMiddlleware.js";
import { generatePasswordResetToken } from "../../utils/generatePasswordToken.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateEmailTemplate } from "../../utils/generateEmailTemplate.js";

export const registerService = async (data, res, next) => {
    
    const { name, email, password } = data;

    const exist = await database.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (exist.rows.length > 0) {
        return next(new ErrorHandler("User already exists with this email", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await database.query(
        "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
        [name, email, hashedPassword]
    );

    return newUser.rows[0];
};

export const loginService = async (data, res, next) => {
   const {email, password} = data;

   const user = await database.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
   );
   if (user.rows.length === 0) {
    return next(new ErrorHandler("Invalid email or password", 401));
   }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
        return next(new ErrorHandler("Invalid password", 401));
    }

    return user.rows[0];
}

export const forgotPasswordService = async (email, frontendUrl) => {
    const userResult = await database.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userResult.rows.length === 0) {
        return { success: false, message: "User not found with this email" };
    }

    const user = userResult.rows[0];

    const { resetToken, hashedToken, expireTime } = generatePasswordResetToken();

    await database.query(
        "UPDATE users SET reset_password_token = $1, reset_password_expires = to_timestamp($2) WHERE id = $3",
        [hashedToken, expireTime / 1000, user.id]
    );

    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;
    const message = generateEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        });
        return { success: true, message: `Email sent to ${user.email} successfully` };
    } catch (error) {
        await database.query(
            "UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = $1",
            [user.id]
        );
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email. Please try again later." };
    }
};

export const resetUserPassword = async (token, newPassword) => {
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const userResult = await database.query(
    "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
    [resetPasswordToken]
  );

  if (userResult.rows.length === 0) {
    throw new Error("Invalid or expired password reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

 const updatedUser = await database.query(
  "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2 RETURNING *",
  [hashedPassword, userResult.rows[0].id]
);

  return updatedUser.rows[0];
};

export const updateUserPassword = async (user, currentPassword, newPassword) => {
  const isMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isMatched) {
    throw new ErrorHandler("Current password is incorrect", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await database.query(
    "UPDATE users SET password = $1 WHERE id = $2",
    [hashedPassword, user.id]
  );

  return true;
};

export const updateUserProfileService = async (name, email, imageData, userId) => {

    let user;

    if (!imageData) {
        user = await database.query(
            "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
            [name, email, userId]
        );
    } else {
        user = await database.query(
            "UPDATE users SET name=$1, email=$2, profile_image_url=$3 WHERE id=$4 RETURNING *",
            [name, email, imageData, userId]
        );
    }

    return user.rows[0];
};
