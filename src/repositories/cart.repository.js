class CartRepository {
    constructor(dao){
        this.dao = dao
    }
    getCarts(){
        return this.dao.get()
    }
    getById(cid){
        return this.dao.getById(cid)
    }
    getEmail(email){
        return this.dao.getEmail(email)
    }
    createCart(uid){
        return this.dao.create(uid)
    }
    addProduct(cid, pid, quantity){
        return this.dao.addProduct(cid, pid, quantity)
    }
    updateProduct(cid, pid, quantity){
        return this.dao.update(cid, pid, quantity)
    }
    updateProductsCart(cid, prodNoStock){
        return this.dao.updateProductsCart(cid, prodNoStock)
    }
    
    deleteProduct(cid, pid){
        return this.dao.deleteProduct(cid, pid)
    }
    deleteAllProducts(cid){
        return this.dao.delete(cid)
    }
}

module.exports = CartRepository