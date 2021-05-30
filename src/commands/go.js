const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class GoCommand extends Command {
  configFile = 'config.json'
  recordsFile = 'records.json'
  pomoTime = 0
  breakTime = 0


  async run() {
    console.clear()

    new Date.toLocaleDateString()
    return

    this.handleFlags()

    let config =  await this.setUpConfiguration()

    let { description } = await this.promptUser()

    await this.readyToStart("Pomodoro")

    while(this.pomoTime > -1) {
      await this.pomodoro()
    }

    await this.readyToStart("Break")

    while(this.breakTime > -1) {
      await this.takeBreak()
    }

    await this.confirmStorageExists()

    await this.storeData({
      ...config,
      description
    })
    
    this.log("Noice.")

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

    // this.pomoTime = config.pomodoro
    // this.breakTime = config.break

    this.pomoTime = 1
    this.breakTime = 1

    return config
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

    if(this.pomoTime > 0)  {
      await this.waitOneMinute()
    }

    this.pomoTime --
  }

  breakDisplay() {
    console.clear()
    this.log(chalk.cyan("Break time left: " + this.breakTime))
  }

  async takeBreak() {
    this.breakDisplay()

    if(this.breakTime > 0)  {
      await this.waitOneMinute()
    }

    this.breakTime --
  }

  async confirmStorageExists() {

    try {
      await fs.ensureDir(this.config.dataDir)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }

  async getRecords() {

    try {
      return await fs.readJSON(path.join(this.config.dataDir, this.recordsFile))
    } catch (e) {
      return  {}
    }
  }

  async storeData(data) {

    const records = await this.getRecords()

    records[new Date.toLocaleDateString()]
    try {
      await fs.writeJSON(path.join(this.config.dataDir, this.recordsFile), data)
    } catch (e) {
      this.error(e, {exit: true})
    }
  }

  async readyToStart(task) {
    await this.confirm("Hit any key to start " + task + "?")
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
  }

  async confirm(msg) {
    return await cli.anykey(msg)
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
