const {Router} = require("express")
const { authUserandAdmin } = require("../jwt/passport-jwt")
const passport = require("passport")
const { uploader } = require("../utils/multer")
const { profileUser, uploadProfileImage, uploadDocuments, uploadProdImage } = require("../controllers/user.controller")
const routerUploads = Router()

routerUploads
    .get(
        "/",
        passport.authenticate('jwt', { session: false }),
        profileUser)
    .post(
        "/:uid/identification",
        passport.authenticate('jwt', { session: false }),
        uploader.single("identification"),
        uploadDocuments)
    .post(
        "/:uid/ProofOfAddress",
        passport.authenticate('jwt', { session: false }),
        uploader.single("ProofOfAddress"),
        uploadDocuments)
    .post(
        "/:uid/ProofOfStatus",
        passport.authenticate('jwt', { session: false }),
        uploader.single("ProofOfStatus"),
        uploadDocuments)
    .post(
        "/:uid/image-product",
        passport.authenticate('jwt', { session: false }),
        uploader.single('productImage'),
        uploadProdImage)
    .post(
        "/:uid/image-profile",
        passport.authenticate('jwt', { session: false }),
        uploader.single('profileImage'),
        uploadProfileImage)

module.exports = routerUploads