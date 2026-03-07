import pkg from 'pg';
const {Client} = pkg;

const database = new Client({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST,
    database    : process.env.DB_NAME,
    password: process.env.DB_PASSWORD || "12345678",
    port: process.env.DB_PORT,
});

try {
    database.connect();
    console.log('Database connected successfully');
} catch (error) {
    console.error('Database connection failed:', error);
}

export default database;