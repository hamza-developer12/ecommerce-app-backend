import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/productController.js";
import express from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../helpers/cloudinarySetup.js";
const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.post("/create", verifyToken, upload.single("image"), createProduct);
productRouter.get("/product/:id", getSingleProduct);
productRouter.delete("/product/:id", verifyToken, deleteProduct);
productRouter.put("/product/update/:id", verifyToken, updateProduct);
export default productRouter;