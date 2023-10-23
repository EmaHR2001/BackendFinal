const { Router } = require("express");

const {get,
    getCartById,
    create,
    addProduct,
    addProductArray,
    deleteProduct,
    deleteAllProducts,
    userCart,
    cartPurchase} = require("../controllers/cart.controller");
const passport = require("passport");
const { authorization, authUserandAdmin } = require("../jwt/passport-jwt");

const cartRouter = Router()

cartRouter
    .get(
        "/user",
        passport.authenticate("jwt", { session: false }),
        userCart)
    //obtener carritos
    .get(
        '/',
        passport.authenticate("jwt", { session: false }),
        get)
    //obtener carrito
    .get(
        '/:cid',
        passport.authenticate("jwt", { session: false }),
        getCartById)
    //crear carrito
    .post(
        '/:uid',
        passport.authenticate("jwt", { session: false }),
        create)
    //añadir producto al carrito
    .post(
        '/:cid/product/:pid',
        passport.authenticate("jwt", { session: false }),
        addProduct)
    //
    .put(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        addProductArray)
    // Borrar producto del carrito
    .delete(
        '/:cid/product/:pid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        deleteProduct)
    // Vaciar carrito
    .delete(
        '/:cid', 
        passport.authenticate("jwt", { session: false }),
        authUserandAdmin(),
        deleteAllProducts)

    .post(
        "/:cid/purcharse",
        passport.authenticate("jwt", { session: false }),
        cartPurchase)
        

module.exports = cartRouter