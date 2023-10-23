const { ProductModel } = require("./models/product.models");

class ProductManagerDao{
    constructor(){
        this.productModel = ProductModel
    }

    async get(){
        try{
            return await this.productModel.find({})
        }catch(err){
            return new Error(err)
        }
    }
    async getById(pid){
        try{
            return await this.productModel.findOne({_id: pid})
        } catch(error){
            return new Error(error)
        }
    }
    async create(newProduct){
        try {
            return await this.productModel.create(newProduct)
        } catch (error) {
            return new Error(error)
        }
    }
    async update(pid, prodToRemplace){
        try {
            await this.productModel.updateOne({_id: pid}, prodToRemplace)
            const productUpdate = this.productModel.findOne({_id: pid})
            return productUpdate
        } catch (error) {
            return new Error(error)
        }
    }
    async delete(pid){
        try {
            return await this.productModel.deleteOne({_id: pid})
        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = ProductManagerDao