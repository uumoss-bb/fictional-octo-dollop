const { expectation } = require("sinon");
const _ViewCommand = require("../commands/view"),
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
  
test("View command, view general overview ", async function () {

  await TestHelper.CreateConfig()
  await TestHelper.CreateRecords()
  
  const ViewCommand = new _ViewCommand([ '--isTesting' ], {})

  let promptStub = sinon.stub(ViewCommand, 'inquir')
  promptStub
  .withArgs([
    {
      type: 'list',
      name: 'selectedView',
      message: 'Id like to view: ',
      choices: ["Todays OverView", "General Overview", "Descriptions of a day"],
    }
  ])
  .returns({
    selectedView: "General Overview"
  })

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  await ViewCommand.run()
  expect(result).toStrictEqual([ '\u001b[32mGeneral Overview\u001b[39m\n' ])

  await TestHelper.DeleteConfig()
  await TestHelper.DeleteRecords()
})

test("View command, view descriptions of a day ", async function () {

  await TestHelper.CreateConfig()
  await TestHelper.CreateRecords()
  
  const ViewCommand = new _ViewCommand([ '--isTesting' ], {})

  let promptStub = sinon.stub(ViewCommand, 'inquir')
  promptStub
  .withArgs([
    {
      type: 'list',
      name: 'selectedView',
      message: 'Id like to view: ',
      choices: ["Todays OverView", "General Overview", "Descriptions of a day"],
    }
  ])
  .returns({
    selectedView: "Descriptions of a day"
  })

  promptStub
  .withArgs([
    {
      type: 'list',
      name: 'selectedDay',
      message: 'Select day to view: ',
      choices: ["5/31/2021"],
    }
  ])
  .returns({
    selectedDay: "5/31/2021"
  })

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  await ViewCommand.run()
  expect(result).toStrictEqual([
    '\u001b[32mWhat I did on 5/31/2021:\u001b[39m\n',
    '- Just doing my BEST!\n',
    '- Just doing my BEST!\n'
  ])

  await TestHelper.DeleteConfig()
  await TestHelper.DeleteRecords()
})

test("View command, view Todays work ", async function () {

  await TestHelper.CreateConfig()
  await TestHelper.CreateRecords()
  
  const ViewCommand = new _ViewCommand([ '--isTesting' ], {})

  let promptStub = sinon.stub(ViewCommand, 'inquir')
  promptStub
  .withArgs([
    {
      type: 'list',
      name: 'selectedView',
      message: 'Id like to view: ',
      choices: ["Todays OverView", "General Overview", "Descriptions of a day"],
    }
  ])
  .returns({
    selectedView: "Todays OverView"
  })

  promptStub
  .withArgs([
    {
      type: 'list',
      name: 'selectedDay',
      message: 'Select day to view: ',
      choices: ["5/31/2021"],
    }
  ])
  .returns({
    selectedDay: "5/31/2021"
  })

  promptStub
  .callsFake(() => {throw new Error("a prompt message is incorrect")})

  await ViewCommand.run()
  
  expect(result).toStrictEqual([
    '\u001b[32mTodays Work:\u001b[39m\n',
    '\u001b[36mTotal Pomodoros: 2 | Total Time: 1.0 hrs | Total Break Time: 10 min\u001b[39m\n',
    '- Just doing my BEST!\n',
    '- Just doing my BEST!\n'
  ])

  await TestHelper.DeleteConfig()
  await TestHelper.DeleteRecords()
})

test("Test organizeRecords", () => {
  const ViewCommand = new _ViewCommand([ '--isTesting' ], {})

  const records = {
    "5/30/2021": {
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
        },
        {
          "pomodoro": 25,
          "break": 5,
          "description": "Just doing my BEST!"
        },
        {
          "pomodoro": 25,
          "break": 5,
          "description": "Just doing my BEST!"
        },
        {
          "pomodoro": 25,
          "break": 5,
          "description": "Testing this cli"
        }
      ]
    },
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
  }

  const res = ViewCommand.organizeRecords(records)
  expect(res).toStrictEqual({"5/30/2021": "Total Pomodoros: 5 | Total Time: 2.30 hrs | Total Break Time: 25 min", "5/31/2021": "Total Pomodoros: 2 | Total Time: 1.0 hrs | Total Break Time: 10 min"})
})