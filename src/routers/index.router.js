const { Router } = require("express")
const { uploader } = require("../utils/multer")
//Routes
const routerProduct = require("./product.router")
const routerSession = require("./session.router")
const routerUser = require("./user.router")
const routerViews = require("./views.router")
const routerMail = require("./mail.router")
const cartRouter = require("./carts.router")
const {routerPrueba} = require("./prueba.router")


const routerIndex = Router()

routerIndex
    .use("/api/product", routerProduct)
    .use("/api/session", routerSession)
    .use("/api/users", routerUser)
    .use("/api/cart", cartRouter)
    .use("/", routerViews)
    .use("/api", routerMail)
    .use("/prueba", routerPrueba)
    .post("/upload", uploader.single("myFile"), (req, res) =>{
    res.send({
        status: "success",
        message: "Archivo subido correctamente"
    })
})

module.exports = routerIndex