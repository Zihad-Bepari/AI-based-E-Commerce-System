import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cokkieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddlleware.js";
import routes from "./routes/index.js";

dotenv.config({path: "./.env"});
const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cokkieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
  tempFileDir: "./upload",
  useTempFiles: true
}))

routes(app);
createTables();
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Ai E-Commerce API is running");
});

export default app;