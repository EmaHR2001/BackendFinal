exports.generateUserErrorInfo = (user) =>{
    return `One or more properties ware incomplete or not valid.
    listado de requeriomientos de propiedades del user:
    * first_name: need to a string, received ${user.first_name}
    * last_name: need to a string, received ${user.last_name}
    * age: need to a string, received ${user.age}
    * email: need to a string, received ${user.email}
    `
}
exports.addToCart = (product) => {
    return `Error al añadir el producto al carrito
    * El producto: ${product.title} No se ha podido añadir al carrito`
}
exports.LoginUserErrorInfo = () =>{
    return `Password or email not valid, please try again:
    *  need to a string, received email
    * last_name: need to a string, received password
    `
}
exports.LoginUserGitHub = () =>{
    return `Error al iniciar o vincular sesión con GitHub,
    por favor intenta nuevamente más tarde
    `
}
exports.AddProductError= (title) =>{
    return `Error al crear el producto: ${title}
    `
}
exports.ModificationProductError= (product) =>{
    return `Error al modificar product
    * Title: need to a string, received ${product.title}
    * Autor: need to a string, received ${product.autor}
    * Description: need to a string, received ${product.description}
    * Price: need to a string, received ${product.price}
    * Code: need to a string, received ${product.code}
    * Stock: need to a string, received ${product.stock}
    * Category: need to a string, received ${product.category}
    `
}