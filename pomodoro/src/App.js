import React from 'react';

let moment = require('moment');

// Display Session or Break Mode and the Time
const Clock = ({mode, timer}) => (
    <div className="timer" style={this.state.alarmColor}>
                        <div className="timer-wrapper">
                            <div id='timer-label'>
                                {mode === 'session' ? 'Session' : 'Break'}
                            </div>
                            <div id='time-left'>
                                {timer}
                            </div>
                        </div>
                    </div>
);



// Set Up Components
class TimerLengthControl extends React.Component {
    render() {
        return (
            <div className="length-control">
                <div id={this.props.titleID}>
                    {this.props.title}
                </div>
                <button id={this.props.minID}
                    className="btn-level" value="-"
                    onClick={this.props.onClick}>
                    <i className="fa fa-arrow-down fa-2x" />
                </button>
                <div id={this.props.lengthID} className="btn-level">
                    {this.props.length}
                </div>
                <button id={this.props.addID}
                    className="btn-level" value="+"
                    onClick={this.props.onClick}>
                    <i className="fa fa-arrow-up fa-2x" />
                </button>
            </div>
        )
    }
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        mode: 'session',
        active: false,
        brkLength: 5,
        seshLength: 25,
        timer: 1500,
        alarmColor: {color: 'white'}     
    };
   
  }
    
  // Updates state when session or break ends and plays sound
    componentDidUpdate() {
    if(this.state.timer === 0 && this.state.mode === 'session') {
      this.setState({ timer: this.state.brkLength * 60, mode: 'break' });
      this.audio.play();
    }
    if(this.state.timer === 0 && this.state.mode === 'break') {
      this.setState({ timer: this.state.seshLength * 60, mode: 'session' });
      this.audio.play();
    } 

    if (this.state.timer < 61) {
        this.setState({alarmColor: {color: 'orangered'}});
    } else {
        this.setState({alarmColor: {color: 'white'}});
    }
  }

  // Play or Pause and Start Timer
  timerControl = () => {
      if(this.state.active) {
          this.setState({active: false}, () => clearInterval(this.pomodoro));
      } else {
          this.setState({active: true}, () => this.pomodoro = setInterval(() => this.setState({timer: this.state.timer - 1})));
      }
  }
 
  // Increase or Decrease a Timer
  counter = (increase, type) => {
      this.setState({[type]: this.state[type] + (increase ? 1 : -1)});
  }

    
         
// Resets Timer
        reset() {
            this.setState({
            mode: 'session',
            active: false,
            brkLength: 5,
            seshLength: 25,
            timer: 1500,
            alarmColor: {color: 'white'}
            
        });
        
        clearInterval(this.pomodoro);
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
        }

        render() {
            return (
                <div>
                    <div className="main-title">Pomodoro Clock</div>
                    <Clock 
                    mode={this.state.mode}
                    timer={moment(this.state.timer).format('mm:ss')}/>
                    <TimerLengthControl titleID="break-label"
                    minID="break-decrement"
                    addID="break-increment"
                    lengthID="break-length"
                    title="Break Length" 
                    onClick={this.counter}
                    length={this.state.brkLength}/>

                    <TimerLengthControl 
                    titleID="session-label" 
                    minID="session-decrement"
                    addID="session-increment"
                    lengthID="session-length"
                    title="Session Length" 
                    onClick={this.counter} 
                    length={this.state.seshLength}/>

                    

                     <div className="timer-control">
                        <button id="start_stop" onClick={this.timerControl}>
                            <i className="fa fa-play fa-2x"/>
                            <i className="fa fa-pause fa-2x"/>
                        </button>
                        <button id="reset" onClick={this.reset}>
                            <i className="fa fa-refresh fa-2x"/>
                        </button>
                    </div>

                    <audio id="beep" preload="auto" 
                        src="https://goo.gl/65cBl1"
                        ref={(audio) => { this.audioBeep = audio; }} />
                </div>


            )
        }
    };

export default Timer;
