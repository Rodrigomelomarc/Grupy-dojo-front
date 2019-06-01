import React from "react";
import "./App.css";

import Clock from "./Components/Clock/index.js"
import Form from "./Components/Form/index.js"


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codingSeconds: '30',
      breakSeconds: '10',
      numberOfTurns: '1',
      formDone: false,
    }
  }

  handleCodingSecondsChange = (e) => {
    this.setState({codingSeconds: e.target.value});
  }

  handleBreakSecondsChange = (e) => {
    this.setState({breakSeconds: e.target.value});
  }

  handleNumberOfTurns = (e) => {
    this.setState({numberOfTurns: e.target.value});
  }

  getFormData = (e) => {
    e.preventDefault();
    this.setState({'formDone': true})
  }



  render() {
    return (
      <div style={{height: '100%'}}>
        <Form 
          codingSeconds={this.state.codingSeconds}
          breakSeconds={this.state.breakSeconds}
          numberOfTurns={this.state.numberOfTurns}
          handleCodingSecondsChange={this.handleCodingSecondsChange}
          handleBreakSecondsChange={this.handleBreakSecondsChange}
          handleNumberOfTurns={this.handleNumberOfTurns}
          getFormData={this.getFormData}
        />
        <Clock 
          totalSessions={4}  
          codingTurnTime={4}
          codingBreakTime={2}
          queueLength={5}
          />;
          
      </div>
    )
  }
}



export default App;
