const { connect } = require("mongoose")
const { envConfig } = require("./config")

let url = envConfig.DATABASE_URL

module.exports = {
    privateKey: envConfig.PRIVATE_KEY,

    connectDB: async () => {
        try {
            connect(url)
        } catch (err) {
            return new Error(err)
        }
    },
}