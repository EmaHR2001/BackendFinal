const {Router} = require("express")
const {getUser, createUsers, deleteUser, updateUsers, getUsers, roleUser, adminUsers , expiratedAccount} = require("../controllers/user.controller")
const { authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const routerUploads = require("./uploads.router")
const { isAdmin } = require("../middlewares/auth.middlewares")
const routerAdmin = require("./admin.router")

const routerUser = Router()

routerUser
    .use("/profile", routerUploads)
    .use("/admin", routerAdmin)
    .get(
        "/users",
        passport.authenticate('jwt', { session: false }),
        isAdmin,
        getUsers)
    .get(
        "/premium/:uid",
        passport.authenticate('jwt', { session: false }),
        roleUser)
    .post(
        "/", 
        passport.authenticate('jwt', { session: false }),
        createUsers)
    .put(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        updateUsers)
    .delete(
        "/expired-users",
        passport.authenticate('jwt', { session: false }),
        expiratedAccount)
    .delete(
        "/:uid", 
        passport.authenticate('jwt', { session: false }),
        isAdmin,
        deleteUser)
    .get(
        "/:uid",
        passport.authenticate('jwt', { session: false }),
        getUser)
module.exports = routerUser