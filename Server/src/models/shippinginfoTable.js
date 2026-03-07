import database from "../../database/db";

export async function createShippingInfoTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS shipping_info (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            order_id UUID NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            city VARHAR(100) NOT NULL,
            address TEXT NOT NULL,
            pincode VARCHAR(20) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES odfers(id) ON DELETE CASCADE
        );`;
        await database.query(query);
        console.log('Shipping info table created successfully');
    } catch (error) {
        console.error('Error creating shipping info table:', error);
        process.exit(1);
    }

}