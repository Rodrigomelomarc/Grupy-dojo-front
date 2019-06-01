import React, { Component } from "react";

export default class Clock extends Component {

  constructor(props) {
    super(props);
    this.state = {
      /* time order
       session : total session number of queue turns
       queueTurn  : actual queue turn
       codingTurn : time to code
       codingBreak : time to switch pilot 
       queue length : the queue total length
       queue counter : used as condition to change queueTurn*/
      totalSessions: this.props.totalSessions,
      queueTurn: 0,
      codingTurnTime: this.props.codingTurnTime,
      codingBreakTime: this.props.codingBreakTime,
      queueLength: this.props.queueLength,
      queueCounter: 0,
      pauseFlag: true,
      nonStarted: true,
      endend: false
    }
    this.initialState = {...this.state};
  }

  decrementCodingTurnTime = () => {
    let codingTurnTime = this.state.codingTurnTime;
    this.setState({codingTurnTime: codingTurnTime - 1});
  }

  resetCodingTurnTime = () => {
    this.setState({codingTurnTime: this.props.codingTurnTime});
  }

  decrementCodingBreakTime = () => {
    let codingBreakTime = this.state.codingBreakTime;
    this.setState({codingBreakTime: codingBreakTime - 1});
  }

  resetCodingBreakTime = () => {
    this.setState({codingBreakTime: this.props.codingBreakTime});
  }

  incrementQueueTurn = () => {
    let queueTurn = this.state.queueTurn
    this.setState({queueTurn: queueTurn + 1});
  }
  
  incrementQueueCounter = () => {
    let queueCounter = this.state.queueCounter;
    this.setState({queueCounter: queueCounter + 1});
  }

  resetQueueCounter = () => {
    this.setState({queueCounter: 0});
  }

  newCodingTurn = () => {
    this.resetCodingTurnTime();
    this.resetCodingBreakTime();
    this.incrementQueueCounter();
  }

  newQueueTurn = () => {
    this.resetQueueCounter();
    this.incrementQueueTurn();
  }
  
  checkCodingTurn = () => {    
    let codingTurnTime = this.state.codingTurnTime;
    let codingBreakTime = this.state.codingBreakTime;
    
    if (codingTurnTime > 0) {
      this.decrementCodingTurnTime();
      return this.decrementer();
    }
    else if (codingBreakTime > 0) {
      this.decrementCodingBreakTime();
      return this.decrementer();
    }
    else {
      this.newCodingTurn();
      return this.decrementer();
    }
  }
  
  checkQueueTurn = () => {
    let queueLength = this.state.queueLength;
    let queueCounter = this.state.queueCounter;
    
    
    if (queueCounter === queueLength) {
      // stops previous decrementer since it will call a new
      clearTimeout(this.state.timeoutPromise);
      this.newQueueTurn();
      return this.decrementer();
    }
  }

  checkEnd = () => {
    let queueTurn = this.state.queueTurn;
    let totalSessions = this.state.totalSessions;
    
    
    if (queueTurn === totalSessions) {
      // stops previous decrementer since it will call a new
      clearTimeout(this.state.timeoutPromise);
      this.setState({endend: true});
    }
  }
  
  handleStartTimer = (e) => {
    e.preventDefault();
    this.decrementer();
  }
  
  handlePausePlayClock = async (e) => {
    e.preventDefault();
    let pauseFlag = this.state.pauseFlag;
    await this.setState(
      {pauseFlag: !pauseFlag, nonStarted: false}
    );
    if (pauseFlag) ; this.decrementer();
  }

  handleReset = async (e) => {
    e.preventDefault();
    await clearTimeout(this.state.timeoutPromise);
    await this.setState({...this.initialState});
    return;
  }

  workflow = async () => {
    await this.checkCodingTurn();
    await this.checkQueueTurn();
    await this.checkEnd();
  }

  decrementer = () => {
    let pauseFlag = this.state.pauseFlag;
    let timeoutPromise;

    if (pauseFlag && this.state.timeoutPromise) {
      clearTimeout(this.state.timeoutPromise);
      return ;
    } else {
      timeoutPromise = setTimeout(() => {
        this.workflow();
      }, 1000);
      this.setState(
        {timeoutPromise: timeoutPromise}
      );
    }
  }

  render() {
    return (
      <div>
        {!this.state.nonStarted ? <button onClick={this.handleReset}>"Reiniciar"</button> : ""}
        <h1>{`CodingTurnTime: ${this.state.codingTurnTime}`}</h1>
        <h1>{`CodingBreakTime: ${this.state.codingBreakTime}`}</h1>
        <h1>{`queueCounter: ${this.state.queueCounter}`}</h1>
        <button onClick={this.handlePausePlayClock}>{
          this.state.pauseFlag ? "Play" : "Pause"
        }</button>
      </div>
    );
  }
}
