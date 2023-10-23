const { envConfig } = require("../config/config");
const { devLogger } = require("../config/devLogger");
const { prodLogger } = require("../config/prodLogger");


function loggerMiddleware(req, res, next) {
    if (envConfig.PERSISTENCE === 'production') {
      req.logger = prodLogger;
      req.logger.info("Logger mode production")
    } else {
      req.logger = devLogger;
      req.logger.info("Logger mode development")
    }
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
  }

  module.exports = { loggerMiddleware }