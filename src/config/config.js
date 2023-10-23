const { ENV_OPTION, program } = require('../utils/persistence')
const { mode } = program.opts()

const envPaths = {
    [ENV_OPTION.DEVELOPMENT]: process.cwd() + "/.env.development",
    [ENV_OPTION.PRODUCTION]: process.cwd() + "/.env.production"
}

require('dotenv').config({
    path: envPaths[mode]
})

exports.envConfig = {

    /* SERVER */
    PORT: process.env.PORT,
    HOST_URL:  process.env.HOST_URL,
    PERSISTENCE: mode,

    /* DATABASE */
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,

/* GITHUB */
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GIT_CALLBACKURL,

/* ADMIN */
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

/* PASSPORT */
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

/* MAIL */
    GMAIL_EMAIL_APP: process.env.GMAIL_EMAIL_APP,
    GMAIL_PASS_APP: process.env.GMAIL_PASS_APP,

/* TWILIO */
TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,

/* My number */
MY_PHONE_NUMBER: process.env.MY_PHONE_NUMBER,

/* Stripe */
STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY

}

