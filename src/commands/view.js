const inquirer = require("inquirer"),
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

    this.handleFlags()

    const records = await this.getRecords()

    if(records) {
      let userInfo = await this.promptUser(records)

      if(userInfo === "General Overview") {
        this.displayOverview(records)
      } else {
        this.displayDescriptions(records, userInfo)
      }
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

  displayOverview(records) {
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

    console.clear()
    this.log(chalk.green("General Overview"))
    console.table(organizedRecords)
  }

  displayDescriptions(records, todaysDate) {

    let todaysRecords =  records[todaysDate].records,
    descriptions = todaysRecords.map(record => record.description)

    console.clear()
    this.log(chalk.green(`What I did on ${todaysDate}:`))
    descriptions.forEach(desc => {
      this.log(`- ${desc}`)
    })
  }

  async inquir(options) {
    return await inquirer.prompt(options)
  }

  async promptUser(records) {

    let res = await this.inquir([
      {
        type: 'list',
        name: 'selectedView',
        message: 'Id like to view: ',
        choices: ["General Overview", "Descriptions of a day"],
      }
    ])

    if(res.selectedView === "Descriptions of a day") {

      let days =  Object.keys(records)
      res = await this.inquir([
        {
          type: 'list',
          name: 'selectedDay',
          message: 'Select day to view: ',
          choices: days,
        }
      ])

      return res.selectedDay
    } else {

      return res.selectedView
    }



    return {
      description
    }
  }
}

ViewCommand.description = `The View command allows you to view the saved records of your past pomodoro's.`

ViewCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: false
  })
}

module.exports = ViewCommand
