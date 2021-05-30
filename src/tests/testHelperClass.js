const fs = require("fs-extra"),
path = require("path"),
shell = require('shelljs')

class buildTestHelper {

  constructor() {
    let res = shell.exec("echo $(pwd)")
    this.dataDir = res.stdout.replace("\n", "") + "/src/tests"
  }

  async CreateAuth() {
    await fs.writeJSON(path.join(this.dataDir, "config_test.json"), {"USERNAME": "testingemail@gmail.com", 'PASSWORD': "somepasswordForTesting!2"})
  }

  async DeleteConfig() {
    await fs.remove(path.join(this.dataDir, "config_test.json"))
  }

  async Create() {
    await fs.writeJSON(path.join(this.dataDir, "records_test.json"), {"test_id":{"SK":"app","PK":"test_id","description":"some app","versions":["0.1.0"],"title":"app1"}})
  }

  async Delete() {
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