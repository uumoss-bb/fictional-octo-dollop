const { cli } = require("cli-ux"),
{ Command, flags } = require('@oclif/command'),
fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs'),
chalk = require('chalk');

class ViewCommand extends Command {
  configFile = 'config.json'
  recordsFile = 'records.json'


  async run() {
    console.clear()

    console.log(this.config.dataDir)

    this.handleFlags()

    const records = await this.getRecords()

    if(records) {
      this.displayRecords(records)
    } else {
      this.log(chalk.red("no records found."))
    }

    return
  }

  handleFlags() {
    const { flags } = this.parse(ViewCommand)
    if(flags.isTesting) {
      this.configFile = "config_test.json"

      let res = shell.pwd()
      this.config.dataDir = res.stdout.replace("\n", "") + "/src/tests"
      this.config.configDir = res.stdout.replace("\n", "") + "/src/tests"
    }
  }

  async getRecords() {

    try {
      return await fs.readJSON(path.join(this.config.dataDir, this.recordsFile))
    } catch (e) {
      return  null
    }
  }

  collecteData(result, record) {

    result.totalPomodoros += 1  
    result.totalTime += record.pomodoro
    result.breakTime += record.break

    return result
  }

  displayRecords(records) {
    let organizedRecords = {}
    let Keys = Object.keys(records),
    Values = Object.values(records)

    for (let key_index = 0; key_index < Keys.length; key_index++) {
      const key = Keys[key_index];

      for (let key_index = 0; key_index < Values.length; key_index++) {
        const value = Values[key_index],
        records = value.records,
        collectedData = records.reduce(this.collecteData, {
          totalTime: 0,
          breakTime: 0,
          totalPomodoros: 0
        })

        organizedRecords[key] = `Total Pomodoros: ${collectedData.totalPomodoros} | Total Time: ${collectedData.totalTime} | Total Break Time: ${collectedData.breakTime}`
      }
    }

    console.table(organizedRecords)
  }
}

ViewCommand.description = `The Config command will allow you to adjust your pomordoro timer.
`

ViewCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = ViewCommand
