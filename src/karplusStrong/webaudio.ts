let audioContext;
export function getAudioContext() {
    if ('localAudioContext' in window) {
        return (window as any).localAudioContext;
    }

    let constructor;
    if ('AudioContext' in window) {
        // Firefox, Chrome
        constructor = window.AudioContext;
    } else if ('webkitAudioContext' in window) {
        // Safari
        constructor = (window as any).webkitAudioContext;
    } else {
        return null;
    }

    audioContext = new constructor();
    (window as any).localAudioContext = audioContext;
    return audioContext;
}