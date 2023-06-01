import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    const cookie = req.cookies.token;
    if (!cookie) {
        return res.status(401).send("Unauthorized")
    }

    const user = await jwt.verify(cookie, process.env.JWT_SECRET);
    if (!user) {
        return res.status(401).send("Un Authorized")
    }
    req.user = user;
    next();
}