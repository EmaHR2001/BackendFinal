const winston = require("winston")

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level:  "http" }),
        new winston.transports.File({ filename: "./errors.log", level: "error"})
    ]
})

// logger exports
module.exports = { prodLogger }
