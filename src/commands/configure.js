const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class ConfigureCommand extends Command {
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
    const { flags } = this.parse(ConfigureCommand)
    if(flags.isTesting) {
      this.filename = "config_test.json"

      let res = shell.pwd()
      this.config.configDir = res.stdout.replace("\n", "") + "/src/tests"
    }
  }

  async promptUser() {

    let pomordoro = await this.prompt(`Enter in the length in minutes for your ${chalk.cyan("pomordoro")}.`, {default: `25`}),
    shortBreak = await this.prompt(`Enter in the length in minutes for your ${chalk.cyan("short break")}.`, {default: `5`}),
    longBreak = await this.prompt(`Enter in the length in minutes for your ${chalk.cyan("long break")}.`, {default: `5`}),
    pomoFrequency = await this.prompt(`Enter in the number of pomordoros between long breaks.`, {default: `3`})

    return {
      pomordoro: Number(pomordoro), 
      shortBreak: Number(shortBreak),
      longBreak: Number(longBreak),
      pomoFrequency: Number(pomoFrequency)
    }
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
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

ConfigureCommand.description = `The Config command will allow you to adjust your pomordoro timer.
`

ConfigureCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = ConfigureCommand