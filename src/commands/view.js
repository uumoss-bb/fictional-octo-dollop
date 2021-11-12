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
    
    this.todaysDate = new Date

    this.handleFlags()
    console.log(this.config.configDir)
    const records = await this.getRecords()

    if(records) {
      let userInfo = await this.promptUser(records)
      console.log(userInfo)
      if(userInfo === "General Overview") {
        this.displayOverview(records)
      } else if(userInfo === "Todays OverView") {
        this.displayToday(records)
      } else{
        this.displayDescriptions(records, userInfo)
      }
    }
    else {
      this.log(chalk.red("no records found."))
    }

    return
  }

  handleFlags() {
    const { flags } = this.parse(ViewCommand)
    if(flags.isTesting) {
      this.configFile = "config_test.json"
      this.recordsFile = 'records_test.json'

      let res = shell.pwd()
      this.config.dataDir = res.stdout.replace("\n", "") + "/src/tests"
      this.config.configDir = res.stdout.replace("\n", "") + "/src/tests"
      this.todaysDate = new Date("5/31/2021")
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
    result.totalTime += record.pomodoro + record.break
    result.breakTime += record.break

    return result
  }

  calculateMinutes(min) {
    let remainingMin = min,
    hours = 0

    if(min < 60) {
      return `${min} min`
    }

    while(remainingMin >= 60) {
      hours ++
      remainingMin -= 60
    }

    return `${hours}.${remainingMin} hrs`
  }

  organizeRecords(records) {
    let organizedRecords = {}
    let Keys = Object.keys(records),
    Values = Object.values(records)

    for (let key_index = 0; key_index < Keys.length; key_index++) {
      const key = Keys[key_index];

      for (let value_index = 0; value_index < Values.length; value_index++) {
        if(key_index === value_index) {
          const value = Values[value_index],
          records = value.records,
          collectedData = records.reduce(this.collecteData, {
            totalTime: 0,
            breakTime: 0,
            totalPomodoros: 0
          })

          organizedRecords[key] = `Total Pomodoros: ${collectedData.totalPomodoros} | Total Time: ${this.calculateMinutes(collectedData.totalTime)} | Total Break Time: ${this.calculateMinutes(collectedData.breakTime)}`
        }
      }
    }

    return organizedRecords
  }

  displayOverview(records) {
    let organizedRecords = this.organizeRecords(records)

    console.clear()
    this.log(chalk.green("General Overview"))
    console.table(organizedRecords)
  }

  displayDescriptions(records, Date) {
    console.log("descriptions")
    let todaysRecords =  records[Date].records,
    descriptions = todaysRecords.map(record => record.description)

    console.clear()
    this.log(chalk.green(`What I did on ${Date}:`))
    descriptions.forEach(desc => {
      this.log(`- ${desc}`)
    })
  }

  displayToday(records) {
    console.log("today")
    let todaysRecords =  records[this.todaysDate.toLocaleDateString()].records,
    descriptions = todaysRecords.map(record => record.description),
    collectedData = todaysRecords.reduce(this.collecteData, {
      totalTime: 0,
      breakTime: 0,
      totalPomodoros: 0
    }),
    todaysTimes = chalk.cyan(`Total Pomodoros: ${collectedData.totalPomodoros} | Total Time: ${this.calculateMinutes(collectedData.totalTime)} | Total Break Time: ${this.calculateMinutes(collectedData.breakTime)}`)
    
    console.clear()
    this.log(chalk.green("Todays Work:"))
    this.log(todaysTimes)
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
        choices: ["Todays OverView", "General Overview", "Descriptions of a day"],
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
  }
}

ViewCommand.description = `The View command allows you to view the saved records of your past pomodoro's.`

ViewCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: true
  })
}

module.exports = ViewCommand
