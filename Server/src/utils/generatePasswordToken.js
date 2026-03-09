import crypto from 'crypto';

export const generatePasswordResetToken = () => {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash the token and set it to resetPasswordToken
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set token expire time (e.g., 15 minutes)

    return { resetToken, hashedToken , expireTime: Date.now() + 15 * 60 * 1000 };

};