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

  await TestHelper.CreateConfig()
  await TestHelper.CreateRecords()
  
  const GoCommand = new _GoCommand([ '--isTesting' ], {})

  let waitStub = sinon.stub(GoCommand, 'waitOneMinute')
  waitStub
  .callsFake(() => "fake waited")

  let getRecordsStub = sinon.stub(GoCommand, 'getTodaysRecords')
  getRecordsStub
  .callsFake(async () => { 
    return {
      records: await TestHelper.GetDataLocaly(),
      today: "5/31/2021",
      todaysRecords: [
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
      ]}
   })

  let promptStub = sinon.stub(GoCommand, 'prompt')
  promptStub
  .withArgs('Enter basic description of the tasks at hand.')
  .returns("test description")

  .withArgs('Silent Mode?.')
  .returns("y")

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  let confirmStub = sinon.stub(GoCommand, 'confirm')
  confirmStub
  .withArgs("Hit any key to start Pomodoro?")
  .returns("some key hit")

  confirmStub
  .withArgs("Hit any key to start Break?")
  .returns("some key hit")

  confirmStub
  .callsFake(() => {throw new Error("a confirm message is incorrect")})

  await GoCommand.run()
  expect(result).toStrictEqual([
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m25\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m24\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m23\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m22\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m21\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m20\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m19\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m18\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m17\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m16\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m15\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m14\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m13\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m12\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m11\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m10\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m9\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m8\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m7\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m6\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m5\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m4\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m3\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m2\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m1\u001b[39m\n',
    'Current Task: \u001b[33mtest description\u001b[39m\n',
    'POMODORO TIME LEFT: \u001b[33m0\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m5\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m4\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m3\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m2\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m1\u001b[39m\n',
    'BREAK TIME LEFT: \u001b[33m0\u001b[39m\n',
    "\u001b[32mCONGRADULATIONS YOU'V COMPLETED 3 POMODOROS TODAY\u001b[39m\n",
    'Noice.\n'
  ])

  let localData = await TestHelper.GetDataLocaly()
  expect(localData).toStrictEqual({"5/31/2021": {"records": [{"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}, {"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}, {"break": 5, "description": "test description", "pomodoro": 25}]}})

  await TestHelper.DeleteConfig()
  await TestHelper.DeleteRecords()
})


test("get todays records", async () => {
  await TestHelper.CreateConfig()
  await TestHelper.CreateRecords()
  
  const GoCommand = new _GoCommand([ '--isTesting' ], {})

  await GoCommand.handleFlags()
  const res = await GoCommand.getTodaysRecords()

  expect(res).toStrictEqual({"records": {"5/31/2021": {"records": [{"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}, {"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}]}}, "today": "5/31/2021", "todaysRecords": [{"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}, {"break": 5, "description": "Just doing my BEST!", "pomodoro": 25}]})
  
  await TestHelper.DeleteConfig()
  await TestHelper.DeleteRecords()
})


//Test get  todays records
