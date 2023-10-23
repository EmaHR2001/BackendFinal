const fs = require('fs')

class CartManager {
    constructor(path) {
        this.carts = []
        this.cartCount = 0
        this.path = path
    }

    // 
    readCarts = async ()=>{
        try {
            if (fs.existsSync(this.path)) {
                const fileContent = await fs.promises.readFile(this.path, 'utf-8')
                const data = JSON.parse(fileContent)
                this.carts= data.cartsList
                this.cartCount = data.index
            }
        } catch (error) {
            return new Error(error)
        }
        return this.carts
    }

    writeFile = async ()=>{
        const data= { index : this.cartCount, cartsList : this.carts }
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data),'utf-8')
        } catch (error) {
            return new Error(error)
        }
    }

    createCart= async ()=>{
        await this.readCarts()
        this.cartCount+=1
        const newCart= {
            id: this.cartCount,
            products : []
        }
        this.carts.push(newCart)
        this.writeFile()
        return {
            status: 'ok',
            data: this.cartCount}
    }

    addToCart= async (cartId, productId)=>{
        await this.readCarts()
        const cartIndex=this.carts.findIndex(cart=>cart.id==cartId)
        if (cartIndex !== -1) {
                // Tengo un carrito. Agrego el producto.
                const cart= this.carts[cartIndex].products
                const prodIndex = cart.findIndex(prod=> prod.id==productId)
                if (prodIndex !== -1) {
                    // ya tengo el producto. Aumento en 1 la cantidad
                    cart[prodIndex]= { ...cart[prodIndex], quantity: cart[prodIndex].quantity+1 }
                } else {
                    // No tengo el producto. Lo agrego.
                    cart.push({id: productId, quantity: 1})
                }
                await this.writeFile()
                return {status: 'ok', data: 'Producto agregado al carrito.'}
            } else {
                // No encontre un carrito.
                return {status: 'error', data: 'error. No existe carrito con id #'+cartId }
            }
    }

    async getcartById(id) {
        // Retorna el cart buscado o undefined.
        const carts = await this.readCarts()
        const searchedCode = carts.find(cart => cart.id ==id)
        if (searchedCode) {
            return {status:'ok', data: searchedCode.products}
        }
        return {status: 'error', data:  "No existe carrito con id "+id}
    }

    async deletecartById(id){
        const carts = await this.readcarts()
        // obtengo el index del elemento.
        const prodIndex=carts.findIndex(cart=>cart.id==id)
        if (prodIndex !== -1) {
            carts.splice(prodIndex,1)
            this.writeFile()     
            return {status:'ok', data:'carrito id '+id+' eliminado exitosamente.'}
        }
        return {status: 'error', data:  "No existe carrito con id "+id}
    }
        
}

module.exports = CartManager