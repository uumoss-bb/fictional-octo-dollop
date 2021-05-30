const _ConfigureCommand = require("../../src/commands/configure"),
sinon = require("sinon"),
buildTestHelper = require("./testHelperClass")

beforeEach(() => {
  result = [];
  jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(val =>
      result.push(val)
    );
});

afterEach(() => {
  jest.restoreAllMocks()
  sinon.restore()
})

const TestHelper = new buildTestHelper()
  
test("Configure command, should be able to take ", async function () {
  
  const ConfigureCommand = new _ConfigureCommand([ '--isTesting' ], {})

  let promptStub = sinon.stub(ConfigureCommand, 'prompt')
  promptStub
  .withArgs('Enter in the length in minutes for your pomodoro.')
  .returns("26")

  promptStub
  .withArgs('Enter in the length in minutes for your break.')
  .returns("6")

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  await ConfigureCommand.run()
  expect(result).toStrictEqual([ 'Data saved, configuration complete.\n' ])

  let localData = await TestHelper.GetConfigLocaly()
  expect(localData).toStrictEqual({"pomodoro":26,"break":6})

  await TestHelper.DeleteConfig()
})