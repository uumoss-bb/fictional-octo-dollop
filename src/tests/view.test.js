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
  
// test("View command, should be able to take ", async function () {
  
//   const ViewCommand = new _ViewCommand([ '--isTesting' ], {})

//   let promptStub = sinon.stub(ViewCommand, 'prompt')
//   promptStub
//   .withArgs('Enter in the length in minutes for your pomodoro.')
//   .returns("26")

//   promptStub
//   .withArgs('Enter in the length in minutes for your break.')
//   .returns("6")

//   promptStub
//   .callsFake(() => {throw new Error("a prompt message is incorrect")})

//   await ViewCommand.run()
//   expect(result).toStrictEqual([ 'Data saved, configuration complete.\n' ])

//   let localData = await TestHelper.GetConfigLocaly()
//   expect(localData).toStrictEqual({"pomodoro":26,"break":6})

//   await TestHelper.DeleteConfig()
// })

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
  expect(res).toStrictEqual({"5/30/2021": "Total Pomodoros: 5 | Total Time: 2.5 hrs | Total Break Time: 25 min", "5/31/2021": "Total Pomodoros: 2 | Total Time: 50 min | Total Break Time: 10 min"})
})