const _ConfigureCommand = require("../../src/commands/configure"),
sinon = require("sinon"),
buildTestHelper = require("../testHelperClass")

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
  
test("Configure command, should take in your VLP login information authenticate it and then store it localy", async function () {
  
  const ConfigureCommand = new _ConfigureCommand([ '--isTesting' ], {})


  let promptStub = sinon.stub(ConfigureCommand, 'prompt')
  promptStub
  .withArgs('Enter your Vived email')
  .returns("testingemail@gmail.com")

  promptStub
  .withArgs('Enter your Vived password')
  .returns("somepasswordForTesting!2")

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  sinon.stub(ConfigureCommand, 'authenticate').returns("successful")

  await ConfigureCommand.run()
  expect(result).toStrictEqual([ 'Data saved, configuration complete.\n' ])

  let localData = await TestHelper.GetCredentialsLocaly()
  expect(localData).toStrictEqual({
    USERNAME: 'testingemail@gmail.com',
    PASSWORD: 'somepasswordForTesting!2'
  })

  await TestHelper.DeleteAuth()
  await TestHelper.Delete()
})