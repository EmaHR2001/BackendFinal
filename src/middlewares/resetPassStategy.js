const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/config');

const resetPassStrategy = (req, res, next) => {
  const token = req.params.token;

  try {
    const decodedToken = jwt.verify(token, envConfig.JWT_SECRET_KEY);

    if(!decodedToken){
        req.logger.error(`El token ah expirado, intente restablecer nuevamente`);
        req.logger.http(`El token ah expirado, intente restablecer nuevamente`);
        res.redirect("/reset-password")
    }
    req.email = decodedToken.email;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Token inválido o expirado' });
  }
};

module.exports = resetPassStrategy;