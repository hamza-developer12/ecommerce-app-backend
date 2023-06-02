import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/userRoutes.js"
import productRouter from './routes/productRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import stripeRouter from './routes/stripe.js';
import orderRouter from './routes/orderRoutes.js';
dotenv.config();
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Connected to db and listening on ${process.env.PORT}`)
    })
}).catch((error) => console.log(error))
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use(stripeRouter)
app.use("/api/orders", orderRouter)
