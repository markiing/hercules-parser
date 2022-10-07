const chalk = require('chalk')

const prefix = "HParser"

const log = console.log
const error = console.error

const StyleLogMessage = {
    'Error': chalk.bgRed.white.bold,
    'Info':chalk.bgBlue.white.bold,
    'Warn':chalk.bgYellow.black.bold

}

const mountMessage = (message, severity) => `${StyleLogMessage[severity](`[${prefix} - ${severity}] ► `)} ${message}`

const showError = (message, args) => {
    error(mountMessage(message, "Error"), args)
}

const showInfo = (message) => {
    log(mountMessage(message, "Info"))
}

const showWarn = (message) => {
    log(mountMessage(message, "Warn"))
}

module.exports = {
    showError,
    showInfo,
    showWarn
}