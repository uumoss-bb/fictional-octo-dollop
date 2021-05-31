const fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs')

class buildTestHelper {

  constructor() {
    let res = shell.exec("echo $(pwd)")
    this.dataDir = res.stdout.replace("\n", "") + "/src/tests"
  }

  async CreateConfig() {
    await fs.writeJSON(path.join(this.dataDir, "config_test.json"), {"pomodoro":25,"break":5})
  }

  async DeleteConfig() {
    await fs.remove(path.join(this.dataDir, "config_test.json"))
  }

  async CreateRecords() {
    await fs.writeJSON(path.join(this.dataDir, "records_test.json"), { 
      "5/31/2021": {
        "records": [
          {
            "pomodoro": 25,
            "break": 5,
            "description": "Just doing my BEST!"
          },
          {
            "pomodoro": 25,
            "break": 5,
            "description": "Just doing my BEST!"
          }
        ]
      }
    })
  }

  async DeleteRecords() {
    await fs.remove(path.join(this.dataDir, "records_test.json"))
  }

  async GetDataLocaly(dataId) {
    let file = await fs.readJSON(path.join(this.dataDir, "records_test.json"))
    return file[dataId]
  }

  async GetConfigLocaly() {
    let file = await fs.readJSON(path.join(this.dataDir, "config_test.json"))
    return file
  }

  async DeleteBuildFolder() {
    let res = shell.exec("echo $(pwd)"),
    projectPath = res.stdout.replace("\n", "")
    await fs.remove(path.join(projectPath, "build"))
  }
}

module.exports = buildTestHelper