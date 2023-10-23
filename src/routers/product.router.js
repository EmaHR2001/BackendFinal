const { Router } = require("express")
const {ProductController} = require("../controllers/product.controller")
const { passportAuth, authorization, authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const { isAdmin } = require("../middlewares/auth.middlewares")

const products = new ProductController()

const routerProduct = Router()

routerProduct.get(
    '/',
    passportAuth('jwt', { session: false }),
    authUserandAdmin(),
    products.getProductsJson)

routerProduct.get(
    '/products',
    passportAuth('jwt', { session: false }),
    authUserandAdmin(),
    products.getProducts)

routerProduct.get(
    "/:pid",
    passport.authenticate('jwt', { session: false }),
    authUserandAdmin(),
    products.getProduct)

routerProduct.post(
    "/",
    passport.authenticate('jwt', { session: false }),
    products.addProduct)

routerProduct.put(
    "/:pid",
    passport.authenticate('jwt', { session: false }),
    products.updateProduct)

routerProduct.delete(
    "/:pid",
    passport.authenticate("jwt", {session: false}),
    authorization("admin"),
    products.deleteProduct)
    
routerProduct.get(
    "/mockingproducts",
    passport.authenticate("jwt", { session: false }),
    authUserandAdmin(),
    products.mockingProducts)

routerProduct.get(
    "/delete/:pid",
    passport.authenticate("jwt", { session: false }),
    products.deleteProductHandlebars)


    module.exports = routerProduct