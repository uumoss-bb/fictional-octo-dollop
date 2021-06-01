const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class BreakCommand extends Command {
  configFile = 'config.json'
  recordsFile = 'records.json'
  breakTaken = 0


  async run() {
    console.clear()

    this.handleFlags()

    await this.readyToStart("Pomodoro")

    await this.takeBreak()

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
    const { flags } = this.parse(BreakCommand)
    if(flags.isTesting) {

      this.configFile = "config_test.json"
      this.recordsFile = 'records_test.json'

      let res = shell.pwd()
      this.config.dataDir = res.stdout + "/src/tests"
      this.config.configDir = res.stdout + "/src/tests"
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
    this.breakTime = config.break

    return config
  }

  async promptUser() {

    let description = await this.prompt('Enter basic description of the tasks at hand.', {default: 'Just doing my BEST!'})

    return {
      description
    }
  }

  interval(logic) {
    let oneMinute = 60000
    return setInterval(logic, oneMinute);
  }

  breakDisplay() {
    console.clear()
    this.log("BREAK TIME LEFT: " + chalk.yellow(this.breakTime))

    // echo -e '\e[2A\e[Knew line'
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
    await this.confirm("Hit any key to start " + task + "?")
  }

  async prompt(msg, options) {
    return await cli.prompt(msg, options)
  }

  async confirm(msg) {
    return await cli.anykey(msg)
  }
}

BreakCommand.description = `The Go command starts your pomodoro and your break right after it.`

BreakCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = BreakCommand
