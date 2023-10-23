const {Router} = require("express")
const passport = require("passport")

const routerViews = Router()

routerViews.get("/login", (req, res) =>{
    res.render("loginView", {})
})
routerViews.get("/register", (req, res) =>{
    res.render("registerView", {
        style: "index.css"
    })
})
routerViews.get("/api/product/products", (req, res) =>{
    res.render("productView", {
        style: "index.css"
    })
})
routerViews.get("/error", (req, res) =>{
    res.render("errorView", {
        style: "index.css"
    })
})
routerViews.get("/reset-password", (req, res) => {
    res.render("reqEmail")
})
routerViews.get("/create-product", (req, res) => {
    res.render("createProd")
})
routerViews.get("/api/users/profil",
passport.authenticate('jwt', { session: false }), (req, res) =>{
    res.render("myProfile", {
        style: "index.css"
    })
})

module.exports = routerViews
