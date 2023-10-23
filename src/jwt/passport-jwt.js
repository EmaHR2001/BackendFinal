const passport = require("passport")
const jwt = require("passport-jwt")
const { privateKey } = require("../config/configServer")
const { UserModel } = require("../dao/mongo/models/user.model")
const GithubStrategy = require("passport-github2")
const { envConfig } = require("../config/config")

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

//Extractor de cookies
const cookieExtractor = (req) => {
    let token = null //inicializamos en null
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]  //Extraemos la cookie y las guardamos en token
    }
    return token
}

//passportJWT
const initPassportJWT = () => {
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: privateKey,
            },
            async (jwt_payload, done) => {
                try {
                    //validar usuarios
                    const user = await UserModel.findById(
                        jwt_payload._id
                    ).lean()
                    if (!user) {
                        return done(null, false, {
                            message: "usuario no encontrado",
                        })
                    }
                    return done(null, user ) // información desencriptada
                } catch (error) {
                    return done(error)
                }
            },
        )
    )

    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
        
    }, async (jwt_payload, done)=>{
        try {
            const user = await UserModel.findById(jwt_payload._doc._id)
            if(!user){
                return done(null, false, {message: "usuario no encontrado"})
            }
            
            return done(null, user) // información desencriptada
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findOne({ _id: id }).lean()
        done(null, user)
    })

}

//passport GITHUB
const initPassportGitHub = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: envConfig.GITHUB_CLIENT_ID, //CLIENTE ID DE GITHUB
                clientSecret: envConfig.GITHUB_CLIENT_SECRET, //Cliente secret de Github
                callbackURL: envConfig.GITHUB_CLIENT_SECRET, //URL de github
            },
            async (accessToken, refreshToke, profile, done) => {
                try {
                    let user = await UserModel.findOne({
                        email: profile._json.email,
                    }).lean()
                    if (user) return done(null, user)
                    if (!user) {
                        let newUser = {
                            username: profile.username,
                            first_name: profile.displayName,
                            email: profile._json.email,
                            password: "",
                        }
                        let result = await UserModel.create(newUser)
                        return done(null, result)
                    }
                    return done(null, user)
                } 
                catch (error) {
                    return done(null, false)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        let user = await UserModel.findOne({_id: id})
        done(null, user)
    })
}

//validar los roles de los usuarios
const authorization = (role) => {
    return async (req, res, next) =>{
        if (!req.user)
            return res.status(401).send({ status: "error", error: "error" })
        if (req.user.role !== role)
            return res.status(403).send({ status: "error", error: "Not permiso" })
        next()
    }
}

const authUserandAdmin = () => {
    return async (req, res, next) =>{
        if (!req.user)
            req.logger.error("Inicia sessión para realizar esta acción")
        if (!req.user.role === 'admin' || !req.user.role === 'user' || !req.user.role === "premium") {
            req.logger.error("No cuentas con el rol necesario para realizar esta acción")
        }
        next()
    }
}
//Validar si viene corrupto o no viene el token
const passportAuth = (strategy, options) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, options, function (err, user, info) {
            if (err) return next(err)
            if (!user)
                return res.status(401).send({
                    status: "error",
                    error: info.messages ? info.messages : info.toString(),
                })
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    initPassportJWT,
    authorization,
    passportAuth,
    authUserandAdmin,
    initPassportGitHub
}