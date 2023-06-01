import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please Provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    }

}, { timestamps: true })

export default mongoose.model("User", userSchema);