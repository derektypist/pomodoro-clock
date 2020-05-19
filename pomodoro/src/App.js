import React from 'react';

let accurateInterval = require('accurate-interval');

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
  constructor() {
    super();
    this.state = {
        mode: 'session',
        active: false,
        brkLength: 5,
        seshLength: 25,
        timer: 1500     
    };
   
  }
    
    componentDidUpdate() {
    if(this.state.timer === 0 && this.state.mode === 'session') {
      this.setState({ timer: this.state.brkLength * 60, mode: 'break' })
      this.audio.play()
    }
    if(this.state.timer === 0 && this.state.mode === 'break') {
      this.setState({ time: this.state.seshLength * 60, mode: 'session' })
      this.audio.play()  
    } 
  }
  setSeshLength(e) {
    this.lengthControl('seshLength', e.currentTarget.value, 
    this.state.seshLength, 'Break');
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') return;
    if (this.state.timerType === timerType) {
      if (sign === "-" && currentLength !== 1 ) {
        this.setState({[stateToChange]: currentLength - 1});
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({[stateToChange]: currentLength + 1});
      } 
    } else {
      if (sign === "-" && currentLength !== 1 ) {
        this.setState({[stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60});
      } else if (sign === "+" && currentLength !== 60) {
        this.setState({[stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60});
      } 
    }
  }
  timerControl() {
      // eslint-disable-next-line
    let control = this.state.timerState === 'stopped' ? (
      this.beginCountDown(),
      this.setState({timerState: 'running'})
    ) : (
      this.setState({timerState: 'stopped'}),
      this.state.intervalID && this.state.intervalID.cancel()
    );
  }

    beginCountDown() {
            this.setState({
            intervalID: accurateInterval(() => {
            this.decrementTimer(); 
            this.phaseControl();
        }, 1000)});
        }

        decrementTimer() {
            this.setState({timer: this.state.timer - 1});
        }

        phaseControl() {
            let timer = this.state.timer;
            this.warning(timer);
            this.buzzer(timer);
            if (timer < 0) { 
            
            // eslint-disable-next-line    
            let phaseC = this.state.timerType === 'Session' ? (this.state.intervalID && this.state.intervalID.cancel(),
        this.beginCountDown(),
        this.switchTimer(this.state.brkLength * 60, 'Break')) : 
      (
        this.state.intervalID && this.state.intervalID.cancel(),
        this.beginCountDown(),
        this.switchTimer(this.state.seshLength * 60, 'Session')
      );
                
            }
        }

        warning(_timer) {
            // eslint-disable-next-line
            let warn = _timer < 61 ? 
            this.setState({alarmColor: {color: 'orangered'}}) : 
            this.setState({alarmColor: {color: 'white'}});
        }

        buzzer(_timer) {
            if (_timer === 0) {
                this.audioBeep.play();
            }
        }

        switchTimer(num, str) {
            this.setState({
            timer: num,
            timerType: str,
            alarmColor: {color: 'white'}
            });
        }

         clockify() {
            let minutes = Math.floor(this.state.timer / 60);
            let seconds = this.state.timer - minutes * 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return minutes + ':' + seconds;
        }

        reset() {
            this.setState({
            brkLength: 5,
            seshLength: 25,
            timerState: 'stopped',
            timerType: 'Session',
            timer: 1500,
            intervalID: '',
            alarmColor: {color: 'white'}
        });
        this.state.intervalID && this.state.intervalID.cancel();
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
        }

        render() {
            return (
                <div>
                    <div className="main-title">Pomodoro Clock</div>
                    <TimerLengthControl titleID="break-label"
                    minID="break-decrement"
                    addID="break-increment"
                    lengthID="break-length"
                    title="Break Length" 
                    onClick={this.setBrkLength}
                    length={this.state.brkLength}/>

                    <TimerLengthControl 
                    titleID="session-label" 
                    minID="session-decrement"
                    addID="session-increment"
                    lengthID="session-length"
                    title="Session Length" 
                    onClick={this.setSeshLength} 
                    length={this.state.seshLength}/>

                    <div className="timer" style={this.state.alarmColor}>
                        <div className="timer-wrapper">
                            <div id='timer-label'>
                                {this.state.timerType}
                            </div>
                            <div id='time-left'>
                                {this.clockify()}
                            </div>
                        </div>
                    </div>

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
