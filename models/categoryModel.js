import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);