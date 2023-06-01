import { createCategory, deleteCategory, getAllCategories, singleCategory } from "../controllers/categoryController.js";
import express from 'express';
import { verifyToken } from "../middlewares/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/create", verifyToken, createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.delete("/category/:id", verifyToken, deleteCategory);
categoryRouter.get("/category/:category", singleCategory)

export default categoryRouter;