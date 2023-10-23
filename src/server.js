const express = require('express')
const hbs  = require('express-handlebars');
const routerIndex = require('./routers/index.router')
const { connectDB } = require('./config/configServer')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const passport = require("passport")
const { initPassport } = require('./config/passport.config')
const { 
    initPassportJWT, 
    initPassportGitHub } = require('./jwt/passport-jwt')
require("dotenv").config()
const {envConfig} = require("./config/config")
const path = require('path')
const { loggerMiddleware } = require('./middlewares/logger.middleware')
const  {Server: ServerHTTP} = require("http")
const swaggerUiExpress = require("swagger-ui-express")
const swaggerjsDoc = require("swagger-jsdoc");
const { devLogger } = require('./config/devLogger');
const app = express()
const serverHttp = ServerHTTP(app)
const PORT = envConfig.PORT || 8080

connectDB()

if (envConfig.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

app.use
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser(''))
app.use(logger("dev"))
app.use(cors())

initPassport()
initPassportJWT()
initPassportGitHub()
app.use(passport.initialize())

app.engine('hbs',
    hbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutDir: __dirname + '/views/layouts',
        helpers: {
            ifCond: function (v1, operator, v2, options) {
                switch (operator) {
                case '==':
                    return v1 == v2 ? options.fn(this) : options.inverse(this);
                case '===':
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
                case '!=':
                    return v1 != v2 ? options.fn(this) : options.inverse(this);
                case '!==':
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case '<':
                    return v1 < v2 ? options.fn(this) : options.inverse(this);
                case '<=':
                    return v1 <= v2 ? options.fn(this) : options.inverse(this);
                case '>':
                    return v1 > v2 ? options.fn(this) : options.inverse(this);
                case '>=':
                    return v1 >= v2 ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
                }
            }
        }
    }),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info:{
            title: "Documentación de AppleShop",
            description: "Esta es la documentacion de AppleShops"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerjsDoc(swaggerOptions)
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(loggerMiddleware)

app.use("/",routerIndex)



app.listen(PORT, (err)=> {
    if (err) devLogger.error('Erro en el servidor', err)
    devLogger.info(`Escuchando en el puerto: ${PORT}`, "info")
    devLogger.info(`Server host: ${envConfig.HOST_URL}${PORT}`)
})