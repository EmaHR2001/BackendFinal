const { Command, Option } = require("commander")


const ENV_OPTION = {
    DEVELOPMENT: "development",
    PRODUCTION: "production"
};

const program = new Command().addOption(
    new Option("--mode <mode>", "Modo de trabajo").choices([
        ENV_OPTION.DEVELOPMENT,
        ENV_OPTION.PRODUCTION
    ])
).parse()

module.exports = {
    ENV_OPTION,
    program
}
