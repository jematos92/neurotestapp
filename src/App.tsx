import React, { Component } from "react";
import "./App.css";
import Gonogotest from "./components/gonogoTest";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Gonogotest />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
