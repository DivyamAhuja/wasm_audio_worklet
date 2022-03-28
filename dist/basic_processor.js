import WASMProcessor from './wasm_processor.js';
import WASMAudioBuffer, { RENDER_QUANTUM_FRAMES } from "./WASMAudioBuffer.js";

class BasicProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.module = WASMProcessor();
        this.processor = new this.module.BasicProcessorWASM();
        this.wasm_buffer = new WASMAudioBuffer(this.module);
        
    }

    process(inputs, outputs) {
        const output_buffer = outputs[0][0];

        this.processor.process(this.wasm_buffer.getPointer());
        output_buffer.set(this.wasm_buffer.getF32Array());
        
        return true;
    }

    _playTone(event) {
        const isDown = event.data;
        isDown ? this._synth.noteOn(60) : this._synth.noteOff(60);
    }
}

registerProcessor('basic-processor', BasicProcessor);