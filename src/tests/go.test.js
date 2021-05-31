const _GoCommand = require("../../src/commands/Go"),
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
  
test("Go command, should be able to take ", async function () {
  
  const GoCommand = new _GoCommand([ '--isTesting' ], {})

  let promptStub = sinon.stub(GoCommand, 'prompt')
  promptStub
  .withArgs('Enter in the length in minutes for your pomodoro.')
  .returns("26")

  promptStub
  .withArgs('Enter in the length in minutes for your break.')
  .returns("6")

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  await GoCommand.run()
  expect(result).toStrictEqual([ 'Data saved, configuration complete.\n' ])

  let localData = await TestHelper.GetConfigLocaly()
  expect(localData).toStrictEqual({"pomodoro":26,"break":6})

  await TestHelper.DeleteConfig()
})