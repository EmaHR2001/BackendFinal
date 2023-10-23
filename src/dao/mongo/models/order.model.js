const {Schema, model} = require("mongoose")

const orderCollection = "orders"

const orderSchema= new Schema({
    name: String,
    category: {
        type: String,
        data: ["phone", "watch"],
        default: "phone",
    },
    price: Number,
    quantity: Number,
    date: Date,
})

const orderModel = model(orderCollection, orderSchema)

module.exports = {
    orderModel
}
