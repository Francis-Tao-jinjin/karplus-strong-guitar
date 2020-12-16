import { GuitarString } from "./guitarString";

export class Guitar {
    static chords = {
        A_Major: [-1, 0, 1, 2, 3, 0],
        B_Major: [ 1, 1, 2, 3, 4, 1],
        C_Major: [-1, 3, 2, 0, 1, 0],
        D_Major: [-1,-1, 0, 1, 3, 2],
        E_Major: [ 0, 2, 3, 1, 0, 0],
        G_Major: [ 2, 1, 0, 0, 0, 3],
        A_Minor: [-1, 0, 2, 3, 1, 0],
        B_Minor: [-1, 1, 3, 4, 2, 1],
        C_Minor: [-1, 1, 3, 4, 2, 1],
        D_Minor: [-1,-1, 0, 2, 3, 1],
        E_Minor: [-1, 2, 3, 0, 0, 0],
        G_Minor: [ 1, 3, 4, 0, 1, 0],
    };

    public strings:GuitarString[];

    public option = {
        characterVariation: 0.5,        // [0.0, 1.0]
        stringDamping: 0.5,             // [0.1, 0.7]
        stringDampingVariation: 0.25,   // [0.0, 0.5]
        pluckDamping: 0.5,              // [0.1, 0.9]
        pluckDampingVariation: 0.25,    // [0.0, 0.5]
        stringTension: 0.0,             // [0.0, 1.0]
        stereoSpread: 0.2,              // [0.0, 1.0]
    };

    constructor(audioCtx:AudioContext, audioDestination:AudioDestinationNode) {
        this.strings = [
            new GuitarString(audioCtx, audioDestination, 0, 2, 4),  // E2
            new GuitarString(audioCtx, audioDestination, 1, 2, 9),  // A2
            new GuitarString(audioCtx, audioDestination, 2, 3, 2),  // D3
            new GuitarString(audioCtx, audioDestination, 3, 3, 7),  // G3
            new GuitarString(audioCtx, audioDestination, 4, 3,11),  // B3
            new GuitarString(audioCtx, audioDestination, 5, 4, 4)   // E4
        ];
    }

    public strumChord = (time:number, downstroke:boolean, velocity:number, chord:number[], slow = false) => {
        let pluckOrder;
        if (downstroke === true) {
            pluckOrder = [0, 1, 2, 3, 4, 5];
        } else {
            pluckOrder = [5, 4, 3, 2, 1, 0];
        }
    
        for (let i = 0; i < 6; i++) {
            let stringNumber = pluckOrder[i];
            if (chord[stringNumber] !== -1) {
                this.strings[stringNumber].pluck(time, velocity, chord[stringNumber], this.option);
            }
            if (slow) {
                time += (Math.random()/128 + 0.1);
            } else {
                time += Math.random()/128;
            }
        }
    }
}