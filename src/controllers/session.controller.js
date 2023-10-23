const { generateToken } = require("../utils/generateTokenJwt")
//passport
const jwt = require("jsonwebtoken")
const { envConfig } = require("../config/config")
const { UserDto } = require("../dto/user.dto")
const { LoginUserErrorInfo, LoginUserGitHub } = require("../utils/CustomError/info")
const { userService } = require("../services")
const { sendEmailResetPassword } = require("../utils/sendmail")
const { createHash, comparePasswords, isValidPassword } = require("../utils/bcryptHash")

class SessionController {

    login = async (req, res, next) => {
        try {
            if(!req.user){
                CustomError.createError({
                    name: "Login error",
                    cause: LoginUserErrorInfo(),
                    message: "Error login user",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            const user = req.user
            const token = generateToken(user)
            res.cookie('coderCookieToken', token, {
                maxAge: 1000*60*60,
                httpOnly: true,
            })
            /* res.status(200).send({ status: "SUCCESS" }) */
            res.redirect("/api/users/profile")
        } catch (error) {
            next(error)
        }
    }

    loginGitHub = async (req, res, next) => {
        try {
            const user = req.user
            if(!user){
                CustomError.createError({
                    name: "Login error",
                    cause: LoginUserGitHub(),
                    message: "Error login user",
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            if (user.username === envConfig.ADMIN_EMAIL) {
                user.role = 'admin'
            } else {
                user.role = 'user'
            }
            const token = generateToken(user)
            res.cookie('coderCookieToken', token, {
                maxAge: 10000*60*60,
                httpOnly: true,
            })
            res.redirect('/api/product/products')
        } catch (error) {
            next(error)
        }
    }

    register = async (req, res) => {
        const { username } = req.body
        res.send({status: "success", payload: username})
    }
    failLogin = (req, res) => {
        res.clearCookie('coderCookieToken')
        res.status(500).send({
            status: "Error",
            message: "Error al iniciar"
        });
        return
    }
    failRegister =  async (req, res) => {
        res.redirect("/err")
    }

    resetpass = async (req, res, next) => {
        try {
            const {email} = req.body
            const emailUser = await userService.getEmail(email)
            if( !emailUser ){
                req.logger.error("No se encontro un email en nuestra base de datos")
                res.status(400).send({
                    status: "Error",
                    message: "No se encontro el email en la base de datos"
                });
                return
            }
            const token = jwt.sign({ email: email }, envConfig.JWT_SECRET_KEY, { expiresIn: "1h" });
            sendEmailResetPassword(email, token)
            req.logger.info(`Se envio un correo de recuperación a ${email}`)
            res.status(200).send({status: "success", message: "Se envio el correo de recuperacion a: "+email})
        
        } catch (error) {
            req.logger.error('Se produjo un error', error);
            next()
            
        }
    }

    resetpassToken = async (req, res, next) => {
        try {
            const token = req.params.token;
            const email = req.email
            if(!token){
                req.logger.error("Error al obtener el token")
                res.status(400).send({
                    status: "Error",
                    message: "Error al obtener el token"
                });
                return
            }
            if(!email){
                req.logger.error("Error al obtener el email")
                res.status(400).send({
                    status: "Error",
                    message: "Error al obtener el email"
                });
                return
            }
            res.render("resetPassword",{
                token,
                email
            })
        } catch (error) {
            req.logger.http('Se produjo un error', error);
            req.logger.error('Se produjo un error', error);
        }
    }

    resetPassForm = async (req, res, next) => {
        try {
            const {email, password, confirmPassword } = req.body;

            const user = await userService.getEmail(email);
            if(!user) {
                req.logger.error(`Error al encontrar el email en la base de datos`)
                res.status(400).send({
                    status: "Error",
                    message: "Error al obtener el email"
                });
                return
            };

            if(password != confirmPassword){
                req.logger.error(`Las contraseñas ingresadas son distintas`)
                res.status(400).send({
                    status: "Error",
                    message: "Las contraseñas ingresadas son distintas"
                });
                return
            };

            const isSamePassword = await comparePasswords(password, user[0].password);
            if (isSamePassword) {
                res.logger.info(`No puedes ingresar la misma contraseña que ya tenías`);
                res.status(400).send({
                    status: "Error",
                    message: "No puedes ingresar la misma contraseña que ya tenía"
                });
                return
            };

            // Actualiza la contraseña del usuario en la base de datos
            const hashedPassword = await createHash(password);
            const userId = user[0]._id
            const userPassUpdate = await userService.updateUserPassword(userId, hashedPassword)
            
            req.logger.info(`Contraseña actualizada correctamente`, userPassUpdate)
            res.status(200).send({
                status: "success",
                message: "contraseña actualizada correctamente"
            })
        } catch (error) {
            req.logger.error('Se produjo un error', error);
        }
    }

    logout = async (req, res) => {
        const userId = req.user._id
        if(!userId){
            res.logger.info(`No es posible realizar el logout de la sesión`);
            res.status(400).send({
                status: "Error",
                message: "No es posible realizar el logout de la sesión"
            });
            return
        }
        await userService.lastConnection(userId, new Date())
        res.clearCookie('coderCookieToken')
        res.status(200).redirect("/login")
    }

    current = (req, res) => {
        const user = req.user
        let userCurrent = new UserDto(user)
        res.send({status: "success", payload: userCurrent})
    }
}

module.exports = new SessionController()