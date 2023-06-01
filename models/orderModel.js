import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const orderSchema = new Schema({
    orderId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    currency: { type: String, },
    address: {
        type: Object,
    },
    customerEmail: {
        type: String,
    },
    customerName: {
        type: String,
    },
    orderStatus: { type: Number, default: 0 },
    items: {
        type: Array,
    },
    quantity: { type: Number },
    customerPhone: { type: String, },
    shippingDetails: {
        type: Object,
    }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema);