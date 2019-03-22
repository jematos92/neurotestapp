import React, { Component } from "react";

interface IGoNoGoTestState {
  testData: GoNoGoTestStep[];
  currentTestIdx: number;
  testStarted: boolean;
}

class GoNoGoTestStep {
  generatedTime!: Date | null;
  generatedReponseTime!: Date | null;
  stimuli!: number | null;
}
class GoNoGoTest extends Component {
  state: IGoNoGoTestState = {
    testData: [
      {
        generatedReponseTime: null,
        generatedTime: null,
        stimuli: 1
      },
      {
        generatedReponseTime: null,
        generatedTime: null,
        stimuli: 0
      },
      {
        generatedReponseTime: null,
        generatedTime: null,
        stimuli: 1
      },
      {
        generatedReponseTime: null,
        generatedTime: null,
        stimuli: 0
      }
    ],
    currentTestIdx: 0,
    testStarted: false
  };

  timePerLabelMs: number = 4000;
  intervalHandle: number = 0;

  //**Handle for the start test button */
  handleStartTestButton = () => {
    var newTestData = [...this.state.testData];
    newTestData.forEach(x => {
      x.generatedReponseTime = null;
      x.generatedTime = null;
    });
    // Mark the response time for the first step.
    newTestData[0].generatedTime = new Date();
    var newState: IGoNoGoTestState = {
      currentTestIdx: 0,
      testStarted: true,
      testData: newTestData
    };
    this.setState(newState);
    this.intervalHandle = window.setInterval(
      this.nextTestStep,
      this.timePerLabelMs
    );
  };

  //**Returns the current test step */
  getCurrentTestStep = (): GoNoGoTestStep => {
    return this.state.testData[this.state.currentTestIdx];
  };

  handleResponse = () => {
    var isLastAnswer =
      this.state.currentTestIdx >= this.state.testData.length - 1;
    //Append the response time and increase the ID
    //We clear the current interval a start a new one for the next label.
    window.clearInterval(this.intervalHandle);
    if (isLastAnswer) {
      this.markComplete(new Date());
      window.clearInterval(this.intervalHandle);
    } else {
      this.moveToNextStep(new Date());
      this.intervalHandle = window.setInterval(
        this.nextTestStep,
        this.timePerLabelMs
      );
    }
  };

  //**Generates the next test step when user doesnt select a response */
  nextTestStep = () => {
    var isLastAnswer =
      this.state.currentTestIdx >= this.state.testData.length - 1;
    if (isLastAnswer) {
      this.markComplete(null);
      window.clearInterval(this.intervalHandle);
    } else {
      this.moveToNextStep(null);
    }
  };
  markComplete = (lastResponse: Date | null) => {
    var newTestData = [...this.state.testData];
    if (lastResponse != null) {
      newTestData[
        this.state.currentTestIdx
      ].generatedReponseTime = lastResponse;
    }
    var newState: IGoNoGoTestState = {
      currentTestIdx: this.state.currentTestIdx,
      testData: newTestData,
      testStarted: false
    };
    this.setState(newState);
  };
  moveToNextStep = (responseTime: Date | null) => {
    var newTestData = [...this.state.testData];
    // The User didnt generate a response.
    newTestData[this.state.currentTestIdx].generatedReponseTime = responseTime;
    // Mark the next step as started.
    newTestData[this.state.currentTestIdx + 1].generatedTime = new Date();
    var newState: IGoNoGoTestState = {
      currentTestIdx: this.state.currentTestIdx + 1,
      testData: newTestData,
      testStarted: true
    };
    this.setState(newState);
  };
  createTable = (): JSX.Element[] => {
    let table: JSX.Element[] = [];
    for (let i = 0; i < this.state.testData.length; i++) {
      table.push(
        <ul className="list-group" key={i}>
          <li className="list-group-item mt-3">{this.getTimeForTable(i)}</li>
        </ul>
      );
    }
    return table;
  };
  getTimeForTable = (i: number) => {
    var testDataStep = this.state.testData[i];
    if (
      i == this.state.currentTestIdx &&
      testDataStep.generatedReponseTime == null &&
      this.state.testStarted == true
    ) {
      return "--";
    }
    if (testDataStep.generatedTime == null) {
      return "Not Answered Yet";
    }
    if (testDataStep.generatedReponseTime == null) {
      return "Not Reponse";
    }
    return (
      testDataStep.generatedReponseTime.getTime() -
      testDataStep.generatedTime.getTime() +
      "ms"
    );
  };

  getStimuli = () => {
    if (this.state.testStarted == false) {
      return <h1 style={{ fontWeight: "bold", fontSize: 220 }}>--</h1>;
    }
    if (this.getCurrentTestStep().stimuli == 1) {
      return <h1 style={{ fontWeight: "bold", fontSize: 220 }}>X</h1>;
    } else {
      return <h1 style={{ fontWeight: "bold", fontSize: 220 }}>O</h1>;
    }
  };
  getStartButton = () => {
    if (!this.state.testStarted) {
      return (
        <button
          className="btn btn-success btn-lg"
          onClick={this.handleStartTestButton}
        >
          START
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-primary btn-lg"
          onClick={this.handleResponse}
        >
          SUBMIT
        </button>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-4 offset-sm-4 text-center">
            {this.getStimuli()}
          </div>
        </div>
        <div className="row">
          <div className="col-4 offset-sm-4 text-center">
            {this.getStartButton()}
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <ul>{this.createTable()}</ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default GoNoGoTest;
