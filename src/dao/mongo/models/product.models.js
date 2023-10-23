const { mongoose, model } = require("mongoose")
const mongoosePaginate = require ("mongoose-paginate-v2")

const Schema = mongoose.Schema

const collection = "products"

const productSchema = new Schema({

    title: {
        type: String,
        index: true
    },
    description: String,
    thumbnail: String,
    price: Number,
    stock: Number,
    category: String,
    code: {
        type: String,
        unique: true,
        required: true,
    },
    owner: { 
        type: Object,
        ref: "usuarios",
        default: "admin"
    },
})

productSchema.plugin(mongoosePaginate)
const ProductModel = model(collection, productSchema)

module.exports = { ProductModel }