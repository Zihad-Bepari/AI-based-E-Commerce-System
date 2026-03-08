import database from "../../database/db.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../../middlewares/errorMiddlleware.js";

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