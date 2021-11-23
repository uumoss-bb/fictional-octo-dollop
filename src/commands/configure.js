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

    this.setUp()

    this.handleFlags()
    
    if(this.useDefault) {

      await this.downloadSound()

      await this.storeData({
        pomodoro: 25, 
        break: 5
      })
    } else {

      let data = await this.promptUser(this.config.configDir)

      await this.confirmStorageExists(this.config.configDir)
  
      await this.storeData(data)
      
      this.log("Data saved, configuration complete.")
    }

    return
  }

  setUp() {
    this.rootLocation = process.mainModule.path.replace("/bin", "/")
  }

  handleFlags() {
    const { flags } = this.parse(ConfigureCommand)

    this.useDefault = flags.useDefault

    if(flags.isTesting) {
      this.filename = "config_test.json"

      let res = shell.pwd()
      this.config.configDir = res.stdout.replace("\n", "") + "/src/tests"
    }
  }

  async promptUser() {

    let pomodoro = await this.prompt(`Enter in the length in minutes for your pomodoro.`, {default: `25`}),
    _break = await this.prompt(`Enter in the length in minutes for your break.`, {default: `5`})

    return {
      pomodoro: Number(pomodoro), 
      break: Number(_break)
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

  async downloadSound() {
    await fs.copy(`${this.rootLocation}/src/sounds/mixkit-scanning-sci-fi-alarm-905.wav`, `${this.config.configDir}/mixkit-scanning-sci-fi-alarm-905.wav`)
    .then(() => console.log('success!'))
    .catch(err => console.error(err))
  }
}

ConfigureCommand.description = `The Config command will allow you to adjust your pomodoro timer.
`

ConfigureCommand.flags = {
  isTesting: flags.boolean({
    char: 'isTesting',
    default: false,
    hidden: true
  }),
  useDefault: flags.boolean({
    char: 'useDefault',
    default: false,
    hidden: true
  })
}

module.exports = ConfigureCommand
