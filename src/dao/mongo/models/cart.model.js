const {Schema, model} = require("mongoose")


const collection = "carrito"

const cartSchema= new Schema({
    clientId: String,
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: Number,
    }]
})

const CartModel = model(collection, cartSchema);

module.exports = {
    CartModel
}