const {Command, flags} = require('@oclif/command')

class Config extends Command {
  async run() {
    const {flags} = this.parse(Config)
    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/commands/hello.js`)
  }
}

Config.description = `Describe the command here
...
Extra documentation goes here
`

Config.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = Config
