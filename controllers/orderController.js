import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
export const createOrder = async (data, products, productQuantity) => {


    let order;
    try {
        order = await orderModel.create({
            orderId: data.id,
            amount: data.amount_total / 100,
            currency: data.currency,
            address: data.customer_details.address,
            customerEmail: data.customer_details.email,
            customerName: data.customer_details.name,
            items: products,
            quantity: productQuantity,
            customerPhone: data.customer_details.phone,
            shippingDetails: data.shipping_details.address,
        })

        await order.save();
        console.log("ORDER CREATED")
        return;
    } catch (error) {
        console.log(error.message)
        return;
    }

}

export const getOrders = async (req, res) => {
    let orders;
    let user;
    try {
        user = await userModel.findOne({ email: req.user.email })
        if (!user) {
            return res.status(401).send("Unauthorized")
        }

        orders = await orderModel.find({ customerEmail: user.email });

        if (!orders) {
            return res.status(404).json({ success: false, msg: "No Order Found" });
        }
        return res.status(200).json({ success: true, orders })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}
