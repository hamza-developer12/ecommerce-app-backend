import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return token;
}

export default generateToken;