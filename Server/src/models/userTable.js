import database from "../database/db.js";

export async function createuserTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL CHECK (char_length(name) >2), 
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
            profile_image_url JSONB DEFAULT NULL,
            reset_password_token TEXT DEFAULT NULL,
            reset_password_expires TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await database.query(query);
    } catch (error) {
        console.error('Error creating user table:', error);
        process.exit(1);
    }

}