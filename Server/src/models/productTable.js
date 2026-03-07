import database from "../../database/db";

export async function createProductTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS products (
            id UUID DEFEAULT GEN_RANDOM_UUID() PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL CHECK (price >>=0),
            category VARCHAR(50) NOT NULL,
            ratings DECIMAL(3,2) DEFAULT 0 CHECK (ratings BETWEEN 0 AND 5),
            product_image JSONB DEFAULT '[]'::JSONB,
            stock INT NOT NULL CHECK (stock >= 0),
            created_by UUID NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCCADE
        );`;
        await database.query(query);
        console.log('products table created successfully');
    } catch (error) {
        console.error('Error creating products table:', error);
        process.exit(1);
    }

}