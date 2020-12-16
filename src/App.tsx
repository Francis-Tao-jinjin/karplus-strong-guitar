import React from 'react';
import './App.css';
import { Guitar } from './karplusStrong/guitar';
import { getAudioContext } from './karplusStrong/webaudio';

interface State {
  isPlay:boolean;
  characterVariation:number;
  stringDamping:number;
  stringDampingVariation:number;
  pluckDamping:number;
  pluckDampingVariation:number;
  stringTension:number;
  stereoSpread:number;
}

interface Props {

}

export class App extends React.Component<Props, State> {

  private guitar:Guitar;
  private audioCtx:AudioContext;

  private timeUnit = 0.12;
  constructor(props:Props) {
    super(props);

    this.audioCtx = getAudioContext();
    this.guitar = new Guitar(this.audioCtx, this.audioCtx.destination);

    (window as any).audioCtx = this.audioCtx;
    (window as any).guitar = this.guitar;
    this.state = {
      isPlay: false,
      characterVariation: this.guitar.option.characterVariation,
      stringDamping: this.guitar.option.stringDamping,
      stringDampingVariation: this.guitar.option.stringDampingVariation,
      pluckDamping: this.guitar.option.pluckDamping,
      pluckDampingVariation: this.guitar.option.pluckDampingVariation,
      stringTension: this.guitar.option.stringTension,
      stereoSpread: this.guitar.option.stereoSpread,
    };
  }

  public startGuitarPlaying() {
    const startSequenceN = 0;
    const blockStartTime = this.audioCtx.currentTime;
    const startChordIndex = 0;
    const precacheTime = 0.0;
    this.queueStrums(startSequenceN, blockStartTime, startChordIndex, precacheTime);
  }

  public queueStrums(sequenceN:number, blockStartTime:number, chordIndex:number, precacheTime:number) {
    const chords = [
      Guitar.chords.C_Major,
      Guitar.chords.G_Major,
      Guitar.chords.A_Minor,
      Guitar.chords.E_Minor,
    ];
    if (this.state.isPlay === false) {
      return;
    }
    let curStrumStartTime = 0;
    const chord = chords[chordIndex];
    switch(sequenceN % 13) {
      case 0:
        curStrumStartTime = blockStartTime + this.timeUnit * 0;
        this.guitar.strumChord(curStrumStartTime, true,  1.0, chord);
        break;
      case 1:
        curStrumStartTime = blockStartTime + this.timeUnit * 4;
        this.guitar.strumChord(curStrumStartTime, true,  1.0, chord);
        break;
      case 2:
        curStrumStartTime = blockStartTime + this.timeUnit * 6;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 3:
        curStrumStartTime = blockStartTime + this.timeUnit * 10;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 4:
        curStrumStartTime = blockStartTime + this.timeUnit * 12;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 5:
        curStrumStartTime = blockStartTime + this.timeUnit * 14;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 6:
        curStrumStartTime = blockStartTime + this.timeUnit * 16;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 7:
        curStrumStartTime = blockStartTime + this.timeUnit * 20;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 8:
        curStrumStartTime = blockStartTime + this.timeUnit * 22;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 9:
        curStrumStartTime = blockStartTime + this.timeUnit * 26;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 10:
        curStrumStartTime = blockStartTime + this.timeUnit * 28;
        this.guitar.strumChord(curStrumStartTime, true, 1.0, chord);
        break;
      case 11:
        curStrumStartTime = blockStartTime + this.timeUnit * 30;
        this.guitar.strumChord(curStrumStartTime, false, 0.8, chord);
        break;
      case 12:
        curStrumStartTime = blockStartTime + this.timeUnit * 31;
        this.guitar.strings[2].pluck(curStrumStartTime, 0.7, chord[2], this.guitar.option);

        curStrumStartTime = blockStartTime + this.timeUnit * 31.5;
        this.guitar.strings[1].pluck(curStrumStartTime, 0.7, chord[1], this.guitar.option);

        chordIndex = (chordIndex + 1) % 4;
        blockStartTime += this.timeUnit * 32;
        break;
    }
    sequenceN++;

    if (curStrumStartTime - this.audioCtx.currentTime < 20) {
      precacheTime += 0.1;
    }
    let generateIn = curStrumStartTime - this.audioCtx.currentTime - precacheTime;
    if (generateIn < 0) {
      generateIn = 0;
    }
    const nextGenerationCall = () => {
      this.queueStrums(sequenceN, blockStartTime, chordIndex, precacheTime);
    }
    setTimeout(nextGenerationCall, generateIn * 1000);
  }

  public render() {
    return (
      <div className="App">
        <button type="button" className='startStopButton'
          onClick={() => {
            if (this.state.isPlay) {
              this.setState({ isPlay: false });
            } else {
              this.setState({ isPlay: true }, () => {
                this.startGuitarPlaying();
              });
            }
          }}>
          {
            this.state.isPlay ? 'Stop' : 'Start'
          }
        </button>
        <div className='controlsRow'>
          <label className='controlLabel'>Character variation</label>
          <input type='range' min={0.0} max={1.0} step={0.1} value={this.state.characterVariation}
            onChange={(ev) => {
              this.setState({ characterVariation: Number(ev.target.value) });
              this.guitar.option.characterVariation = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.characterVariation}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>String damping</label>
          <input type='range' min={0.0} max={1.0} step={0.1} value={this.state.stringDamping}
            onChange={(ev) => {
              this.setState({ stringDamping: Number(ev.target.value) });
              this.guitar.option.stringDamping = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.stringDamping}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>String damping variation</label>
          <input type='range' min={0.0} max={0.5} step={0.05} value={this.state.stringDampingVariation}
            onChange={(ev) => {
              this.setState({ stringDampingVariation: Number(ev.target.value) });
              this.guitar.option.stringDampingVariation = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.stringDampingVariation}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>Pluck damping</label>
          <input type='range' min={0.1} max={0.9} step={0.1} value={this.state.pluckDamping}
            onChange={(ev) => {
              this.setState({ pluckDamping: Number(ev.target.value) });
              this.guitar.option.pluckDamping = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.pluckDamping}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>Pluck damping variation</label>
          <input type='range' min={0.0} max={0.5} step={0.05} value={this.state.pluckDampingVariation}
            onChange={(ev) => {
              this.setState({ pluckDampingVariation: Number(ev.target.value) });
              this.guitar.option.pluckDampingVariation = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.pluckDampingVariation}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>String tension</label>
          <input type='range' min={0.0} max={1.0} step={0.1} value={this.state.stringTension}
            onChange={(ev) => {
              this.setState({ stringTension: Number(ev.target.value) });
              this.guitar.option.stringTension = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.stringTension}</div>
        </div>
        <div className='controlsRow'>
          <label className='controlLabel'>Stereo spread</label>
          <input type='range' min={0.0} max={1.0} step={0.1} value={this.state.stereoSpread}
            onChange={(ev) => {
              this.setState({ stereoSpread: Number(ev.target.value) });
              this.guitar.option.stereoSpread = Number(ev.target.value);
            }}></input>
          <div className='dataValue'>{this.state.stereoSpread}</div>
        </div>
      </div>
    );
  }
}

export default App;
