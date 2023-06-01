import express from 'express';
import { addUser, login, loginStatus, logoutUser } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.post("/register", addUser);
userRouter.post("/login", login);
userRouter.get('/logout', verifyToken, logoutUser);
userRouter.get("/login-status", verifyToken, loginStatus);

export default userRouter;