class ProductRepository {
    constructor(dao){
        this.dao = dao
    }
    getProducts(){
        return this.dao.get()
    }
    getProduct(pid){
        return this.dao.getById(pid)
    }
    createProduct(newProduct){
        return this.dao.create(newProduct)
    }
    update(pid, prodToRemplace){
        return this.dao.update(pid, prodToRemplace)
    }
    deleteProduct(pid){
        return this.dao.delete(pid)
    }
}

module.exports = ProductRepository