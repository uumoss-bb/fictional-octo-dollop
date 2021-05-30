const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class GoCommand extends Command {
  configFile = 'config.json'
  pomoTime = 0

  async run() {
    console.clear()

    this.handleFlags()

    let { description } = await this.promptUser(this.config.dataDir)

    //timer

    await this.confirmStorageExists(this.config.dataDir)

    await this.storeData(data)
    
    this.log("Data saved, configuration complete.")

    return
  }

  handleFlags() {
    const { flags } = this.parse(GoCommand)
    if(flags.isTesting) {
      this.configFile = "config_test.json"

      let res = shell.pwd()
      this.config.dataDir = res.stdout.replace("\n", "") + "/src/tests"
      this.config.configDir = res.stdout.replace("\n", "") + "/src/tests"
    }
  }

  async promptUser() {

    let description = await this.prompt('Enter basic description of the tasks at hand.', {default: 'Just doing my BEST!'})

    return {
      description
    }
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
  }

  async getConfigs() {

    try {
      return await fs.readJSON(path.join(this.config.configDir, this.configFile))
    } catch (e) {
      return null
    }
  }

  async pomodoro() {
    const config = await this.getConfigs()
    

  }

  async confirmStorageExists() {

    try {
      await fs.ensureDir(this.config.dataDir)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }

  async storeData(data) {

    try {
      await fs.writeJSON(path.join(this.config.dataDir, this.configFile), data)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }
}

GoCommand.description = `The Config command will allow you to adjust your pomordoro timer.
`

GoCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = GoCommand
