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

    await this.setUpConfiguration()

    let { description } = await this.promptUser(this.config.dataDir)

    await this.readyToStart("Pomodoro")

    while(this.pomoTime > 0) {
      await this.pomodoro()
    }

    await this.readyToStart("Break")


  //  if(this.pomoTime <= 0) {
  //   // await this.confirmStorageExists(this.config.dataDir)

  //   // await this.storeData(data)
    
  //   this.log("Noice.")
  //  }

   this.log("all done")

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

  async getConfigs() {

    try {
      return await fs.readJSON(path.join(this.config.configDir, this.configFile))
    } catch (e) {
      this.error(chalk.red(`Configes not found. Please run: `) + "pomo configure" +  chalk.red(`. Then try again.`))
    }
  }

  async setUpConfiguration() {
    const config = await this.getConfigs()

    this.pomoTime = config.pomodoro
  }

  async promptUser() {

    let description = await this.prompt('Enter basic description of the tasks at hand.', {default: 'Just doing my BEST!'})

    return {
      description
    }
  }

  waitOneMinute() {
    let oneMinute = 3000
    return new Promise(resolve => setTimeout(resolve, oneMinute));
  }

  pomoDisplay() {
    console.clear()
    this.log(chalk.cyan("Pomorodo time left: " + this.pomoTime))
  }

  async pomodoro() {
    this.pomoDisplay()

    if(this.pomoTime <= 0)  {
      this.stopInterval()
    } else {
      await this.waitOneMinute()
    }

    this.pomoTime --
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

  async readyToStart(task) {
    await this.confirm("Ready to start " + task + "?")
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
  }

  async confirm(msg) {
    return await cli.confirm(msg)
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
