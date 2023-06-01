import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please Add a Name"],
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    quantity: {
        type: String,
        required: [true, "Please add quantity"],
        trim: true,
    },
    price: {
        type: String,
        required: [true, "Please add Price"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please add description"],
        trim: true,
    },
    image: {
        type: Object,
    }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);