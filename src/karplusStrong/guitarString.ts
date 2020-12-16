import { AsmComponent } from './guitarStringASM';

export class GuitarString {
    private audioCtx:AudioContext;
    private audioDestination:AudioDestinationNode;

    private basicHz:number;

    public semitoneIndex:number;
    private noise:Float32Array;
    private acousticLocation:number;
    private asm:AsmComponent;

    constructor(audioCtx:AudioContext, audioDestination:AudioDestinationNode,
                stringN:number, octave:number, semitone:number) {
        
        this.audioCtx = audioCtx;
        this.audioDestination = audioDestination;
        // work from A0 as a reference,
        // since it has a nice round frequency
        const a0_hz = 27.5;
        // an increase in octave by 1 doubles the frequency
        // each octave is divided into 12 semitones
        // the scale goes C0, C0#, D0, D0#, E0, F0, F0#, G0, G0#, A0, A0#, B0
        // so go back 9 semitones to get to C0
        const c0_hz = a0_hz * Math.pow(2, -9/12);
        
        this.basicHz = c0_hz * Math.pow(2, octave + semitone / 12);
        this.basicHz = Number(this.basicHz.toFixed(2));
        
        const basicPeriod = 1 / this.basicHz;
        const basicPeriodSamples = Math.round(basicPeriod * audioCtx.sampleRate);
        this.noise = this.generateNoise(basicPeriodSamples);
        
        this.semitoneIndex = octave * 12 + semitone - 9;
        this.acousticLocation = (stringN - 2.5) * 0.4;
        this.asm = new AsmComponent();
    }

    private generateNoise(samples:number) {
        const noiseArray = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            noiseArray[i] = -1 + 2 * Math.random();
        }
        return noiseArray;
    }

    // 'tab' represents which fret is held while plucking
    // each fret represents an increase in pitch by one semitone
    public pluck (startTime:number, velocity:number, tab:number, options:any) {
        const channels = 2;
        const sampleRate = this.audioCtx.sampleRate;
        const sampleCount = 1.0 * sampleRate;
        const buffer = this.audioCtx.createBuffer(channels, sampleCount, sampleRate);

        const smoothingFactor = calculateSmoothingFactor(this, tab, options);
        const hz = this.basicHz * Math.pow(2, tab/12);

        velocity /= 4;
        this.asm.pluck(buffer, this.noise, sampleRate, hz,
                        smoothingFactor, velocity, options, this.acousticLocation);
        
        const bufferSource = this.audioCtx.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(this.audioDestination);
        bufferSource.start(startTime);
    }
}

function calculateSmoothingFactor(string:GuitarString, tab:number, options:any) {
    let smoothingFactor;
    // if (options.stringDampingCalculation === 'direct') {
    //     smoothingFactor = options.stringDamping;
    // } else if (options.stringDampingCalculation === 'magic') {
        const noteNumber = (string.semitoneIndex + tab - 19)/44;
        smoothingFactor =
            options.stringDamping +
            Math.pow(noteNumber, 0.5) * (1 - options.stringDamping) * 0.5 +
            (1 - options.stringDamping) *
                Math.random() *
                options.stringDampingVariation;
    // }
    return smoothingFactor;
}