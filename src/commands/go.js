const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk'),
Sound = require('play-sound');

class GoCommand extends Command {
  configFile = 'config.json'
  recordsFile = 'records.json'
  pomoTime = 0
  breakTime = 0

  // /System/Library/Sounds/
  
  async run() {
    console.clear()

    this.setUp()

    this.handleFlags()

    let config =  await this.setUpConfiguration()

    let { description, silentMode } = await this.promptUser()
    this.silentMode = silentMode

    await this.readyToStart("Pomodoro")

    while(this.pomoTime > -1) {
      await this.pomodoro(description)
    }

    await this.alarm()

    await this.confirmStorageExists()

    await this.storeData({
      ...config,
      description
    })

    await this.readyToStart("Break")

    while(this.breakTime > -1) {
      await this.takeBreak()
    }

    await this.alarm()
    console.clear()
    
    this.log("Noice.")

    return
  }

  setUp() {
    this.silentMode = false
    this.todaysDate = new Date
  }

  handleFlags() {
    const { flags } = this.parse(GoCommand)
    if(flags.isTesting) {

      this.configFile = "config_test.json"
      this.recordsFile = 'records_test.json'

      let res = shell.pwd()
      this.config.dataDir = res.stdout + "/src/tests"
      this.config.configDir = res.stdout + "/src/tests"
      this.todaysDate = new Date("5/31/2021")
    }
  }

  async alarm() {
    if(!this.silentMode) {
      
      await new Promise(res => {
        var _sound = new Sound().play(`${this.config.configDir}/bell-ringing.mp3`)
        setTimeout(function () {
          _sound.kill();
          res()
        }, 3200);
      })
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

    let silentMode = await this.prompt('Silent Mode?.', {default: "No"})

    let description = await this.prompt('Enter basic description of the tasks at hand.', {default: 'Just doing my BEST!'})

    if(silentMode.toLowerCase() === "yes" || silentMode.toLowerCase() === "y") {
      silentMode = true
    } else {
      silentMode = false
    }

    return {
      description,
      silentMode
    }
  }

  waitOneMinute() {
    let oneMinute = 60000
    return new Promise(resolve => setTimeout(resolve, oneMinute));
  }

  pomoDisplay(description) {
    console.clear()
    this.log("Current Task: " + chalk.yellow(description))
    this.log("POMODORO TIME LEFT: " + chalk.yellow(this.pomoTime))
  }

  async pomodoro(description) {
    this.pomoDisplay(description)

    if(this.pomoTime > 0)  {
      await this.waitOneMinute()
    }

    this.pomoTime --
  }

  breakDisplay() {
    console.clear()
    this.log("BREAK TIME LEFT: " + chalk.yellow(this.breakTime))
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

    let _date = this.todaysDate,
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
      this.log(chalk.green("CONGRADULATIONS YOU'VE COMPLETED " + records[today].records.length + " POMODOROS TODAY \n"))
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

GoCommand.description = `The Go command starts your pomodoro and your break right after it.`

GoCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: true
  })
}

module.exports = GoCommand
