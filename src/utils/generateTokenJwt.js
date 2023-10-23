const jwt = require("jsonwebtoken")

const {privateKey} = require("../config/configServer")

const generateToken = (objUser) =>{
    return jwt.sign(objUser, privateKey, {expiresIn: "1d"})
}

module.exports = {generateToken}