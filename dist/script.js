

const audio_button = document.querySelector('#audio-button');


const createAudioContext = async () => {
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule('basic_processor.js');
    
    const basic_processor = new AudioWorkletNode(audioContext, 'basic-processor');
    basic_processor.connect(audioContext.destination);
    
    audioContext.suspend();
    return audioContext;
}



let firstClick = true;
let audioContext;
let on = false;
audio_button.addEventListener('click', async () => {
    if (firstClick) {
        audioContext = await createAudioContext();
        firstClick = false;
    };
    if (!on) {
        audioContext.resume().then(() => {
            on = true;
            audio_button.classList.toggle("on")
            audio_button.classList.toggle("off")
        });
    } else {
        audioContext.suspend().then(() => {
            on = false;
            audio_button.classList.toggle("on")
            audio_button.classList.toggle("off")
        });
    }
});