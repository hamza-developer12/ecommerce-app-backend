import userModel from "../models/userModel.js";
import { hashPassword, comparePassword } from "../middlewares/passwordMiddleware.js";
import generateToken from "../helpers/generateToken.js";
export const addUser = async (req, res) => {
    const { name, email, password } = req.body;
    let user;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, msg: "Please provide All the details" })
    }
    try {
        user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, msg: "User Already Exists" })
        }

        let newUser = await userModel.create({
            name, email, password: await hashPassword(password)
        });

        await newUser.save();
        return res.status(201).json({ success: true, msg: "User Created successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    let user;


    if (!email || !password) {
        return res.status(400).json({ success: false, msg: "Please provide login details" })
    }

    try {
        user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" })
        }

        const matchPassword = await comparePassword(password, user.password);

        if (!matchPassword) {
            return res.status(400).json({ success: false, msg: "Invalid Email or password" })
        }
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email
        }
        const token = generateToken(userData)
        const oneDay = 7 * 24 * 60 * 60 * 1000;
        const expiryDate = new Date(Date.now() + oneDay);
        res.cookie("token", token, {
            expires: expiryDate,
            httpOnly: true,
            path: '/',
            sameSite: "none",
            })
        return res.status(200).json({
            success: true, user: {
                name: user.name,
                email: user.email,
                role: user.role,
            }, token
        })
    }

    catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const loginStatus = async (req, res) => {
    let user;

    try {
        user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ success: false, msg: "User Not Found" })
        }

        return res.status(200).json({
            success: true, user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {

    }
}
export const logoutUser = async (req, res) => {
    res.clearCookie('token', { httpOnly: true })

    return res.status(200).json({ msg: "Logout Successfull" })
}


