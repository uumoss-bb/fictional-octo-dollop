const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class ConfigCommand extends Command {
  filename = 'config.json'

  async run() {
    console.clear()

    this.handleFlags()

    let data = await this.promptUser(this.config.configDir)

    await this.confirmStorageExists(this.config.configDir)

    await this.storeData(data)
    
    this.log("Data saved, configuration complete.")

    return
  }

  handleFlags() {
    const { flags } = this.parse(ConfigCommand)
    if(flags.isTesting) {
      this.filename = "credentials_test.json"

      let res = shell.pwd()
      this.config.configDir = res.stdout.replace("\n", "") + "/test"
    }
  }

  async promptUser() {

    let pomordoro = await this.prompt('Enter in the length in minutes for your pomordoro.', {default: '25'}),
    shortBreak = await this.prompt('Enter in the length in minutes for your short break.', {default: '5'}),
    longBreak = await this.prompt('Enter in the length in minutes for your long break.', {default: '5'}),
    pomoFrequency = await this.prompt('Enter in the number of pomordoros between long breaks.', {default: '3'})

    return {
      pomordoro, 
      shortBreak,
      longBreak,
      pomoFrequency
    }
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
  }

  async getCredentials() {

    try {
      return await fs.readJSON(path.join(this.config.configDir, this.filename))
    } catch (e) {
      return null
    }
  }

  async authenticate(email, password) {
    cli.action.start('Authenticating')

    try {
      await authenticateUser(email, password)
      cli.action.stop(chalk.green("SUCCESSFULL"))
    } catch (e) {
      cli.action.stop(chalk.red("FAILED"))
      this.error("We could not authenticate your information, please try again.\n")
      return
    }
  }

  async confirmStorageExists() {

    try {
      await fs.ensureDir(this.config.configDir)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }

  async storeData(data) {

    try {
      await fs.writeJSON(path.join(this.config.configDir, this.filename), data)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }
}

ConfigCommand.description = `The Config command will allow you to adjust your pomordoro timer.
`

ConfigCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = ConfigCommand
