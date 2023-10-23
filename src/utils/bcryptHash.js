const bcrypt = require("bcrypt")

// crear el hash - lo usamos en register

exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//generar la función para comparar contraseñas- lo usamos en login

exports.isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

exports.comparePasswords = (newPassword, userPass) => bcrypt.compare(newPassword, userPass);