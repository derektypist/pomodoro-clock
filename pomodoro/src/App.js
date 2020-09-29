import React from 'react';

const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};



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
      brkLength: 5,
      seshLength: 25,
      timerState: 'stopped',
      timerType: 'Session',
      timer: 1500,
      intervalID: '',
      alarmColor: { color: 'white' }
    };
    this.setBrkLength = this.setBrkLength.bind(this);
    this.setSeshLength = this.setSeshLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.clockify = this.clockify.bind(this);
    this.reset = this.reset.bind(this);
  }
  setBrkLength(e) {
    this.lengthControl(
      'brkLength',
      e.currentTarget.value,
      this.state.brkLength,
      'Session'
    );
  }
  setSeshLength(e) {
    this.lengthControl(
      'seshLength',
      e.currentTarget.value,
      this.state.seshLength,
      'Break'
    );
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === '-' && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === '+' && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === '-' && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (sign === '+' && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }
  timerControl() {
    if (this.state.timerState === 'stopped') {
      this.beginCountDown();
      this.setState({ timerState: 'running' });
    } else {
      this.setState({ timerState: 'stopped' });
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
    }
  }
  beginCountDown() {
    this.setState({
      intervalID: accurateInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000)
    });
  }
  decrementTimer() {
    this.setState({ timer: this.state.timer - 1 });
  }
  phaseControl() {
    let timer = this.state.timer;
    this.warning(timer);
    this.buzzer(timer);
    if (timer < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      if (this.state.timerType === 'Session') {
        this.beginCountDown();
        this.switchTimer(this.state.brkLength * 60, 'Break');
      } else {
        this.beginCountDown();
        this.switchTimer(this.state.seshLength * 60, 'Session');
      }
    }
  }
  warning(_timer) {
    if (_timer < 61) {
      this.setState({ alarmColor: { color: '#a50d0d' } });
    } else {
      this.setState({ alarmColor: { color: 'white' } });
    }
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
      alarmColor: { color: 'white' }
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
      alarmColor: { color: 'white' }
    });
    if (this.state.intervalID) {
      this.state.intervalID.cancel();
    }
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  render() {
    return (
      <div>
        <div className="main-title">25 + 5 Clock</div>
        <TimerLengthControl
          addID="break-increment"
          length={this.state.brkLength}
          lengthID="break-length"
          minID="break-decrement"
          onClick={this.setBrkLength}
          title="Break Length"
          titleID="break-label"
        />
        <TimerLengthControl
          addID="session-increment"
          length={this.state.seshLength}
          lengthID="session-length"
          minID="session-decrement"
          onClick={this.setSeshLength}
          title="Session Length"
          titleID="session-label"
        />
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.clockify()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x" />
            <i className="fa fa-pause fa-2x" />
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x" />
          </button>
        </div>
        
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
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
