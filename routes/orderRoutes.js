import express from 'express';
import { getOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get("/", verifyToken, getOrders)

export default router;