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

    console.log(this.config.dataDir)

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

    console.clear()
    
    await this.confirmStorageExists()

    await this.storeData({
      ...config,
      description
    })
    
    this.log("Noice.")

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
    this.log("POMODORO TIME LEFT: " + chalk.green(this.pomoTime))
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
    this.log("BREAK TIME LEFT: " + chalk.green(this.breakTime))
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

  async getTodaysRecords() {
    const records = await this.getRecords()

    let _date = new Date,
    today = _date.toLocaleDateString(),
    todaysRecords = records[today]

    if(todaysRecords) {

      if(todaysRecords.records) {
        return  { todaysRecords:  todaysRecords.records, today, records }
      } else  {
        return { todaysRecords:  [], today, records }
      }

    } else {
      records[today] = {}
      return  { todaysRecords:  [], today, records }
    }
  }

  async storeData(data) {

    let { todaysRecords, today, records } = await this.getTodaysRecords()

    records[today].records = [...todaysRecords, data]

    try {
      await fs.writeJSON(path.join(this.config.dataDir, this.recordsFile), records)
      this.log(chalk.green("CONGRADULATIONS YOU'V COMPLETED " + records[today].records.length + " POMODOROS TODAY"))
    } catch (e) {
      this.error(e, {exit: true})
    }
  }

  async readyToStart(task) {
    console.clear()
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
