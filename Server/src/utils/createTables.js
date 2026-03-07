import { createuserTable } from "../models/userTable.js";
import { createorderItemsTable } from "../models/orderItemsTable.js";
import { createordersTable } from "../models/ordersTable.js";
import { createpaymentTable } from "../models/paymentTable.js";
import { createproductTable } from "../models/productTable.js";
import { createshippingInfoTable } from "../models/shippinginfoTable.js";
import { createproductReviewsTable } from "../models/productReviewsTable.js";

export const createTables = async () => {
    try{
        await createuserTable();
        await createproductTable();
        await createordersTable();
        await createorderItemsTable();
        await createpaymentTable();
        await createshippingInfoTable();
        await createproductReviewsTable();
        console.log("All tables created successfully");
    } catch(error){
        console.error("Error creating tables:", error);
    }
}