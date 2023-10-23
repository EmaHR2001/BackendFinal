const {Command} = require("commander")

const commander = new Command

commander
    .option("--mode <mode>", "Modo de trabajo", "production")
    .parse()

module.exports = {
    commander
}