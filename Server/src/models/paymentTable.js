import database from "../../database/db";

export async function createPaymentTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS payments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            order_id UUID NOT NULL UNIQUE,
            payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Online')),
            payment_status VARCHAR(20) NOT NUL CHECK (payent_status IN ('Pending', 'Paid', 'Failed')),
            payment_intent_id VARCHAR(100) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            foreign KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        );`;
        await database.query(query);
        console.log('Payment table created successfully');
    } catch (error) {
        console.error('Error creating payment table:', error);
        process.exit(1);
    }

}