import pkg from 'pg';
const {client} = pkg;

const database = new client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database    : process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

try {
    database.connect();
    console.log('Database connected successfully');
} catch (error) {
    console.error('Database connection failed:', error);
}

export default database;