import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);

    return hash;
}

export const comparePassword = async (userPassword, password) => {
    const compare = await bcrypt.compare(userPassword, password);
    return compare;
}