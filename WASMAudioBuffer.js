export const BYTES_PER_UNIT = Uint16Array.BYTES_PER_ELEMENT;
export const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;
export const MAX_CHANNEL_COUNT = 32;
export const RENDER_QUANTUM_FRAMES = 128;

class WASMAudioBuffer {
    constructor(wasm_module, length = 128, channel_count = 1, max_channel_count = 1) {
        this._isInitialized = false;
        this._module = wasm_module;
        this._length = length;
        this._maxChannelCount = max_channel_count
            ? Math.min(this.maxChanneCount, MAX_CHANNEL_COUNT)
            : channel_count;
        this._channelCount = channel_count;
        this._allocateHeap();
        this._isInitialized = true;
    }

    _allocateHeap() {
        const channelByteSize = this._length * BYTES_PER_SAMPLE;
        const dataByteSize = this._channelCount * channelByteSize;
        this._dataPtr = this._module._malloc(dataByteSize);
        this._channelData = [];
        for (let i = 0; i < this._channelCount; ++i) {
            let startByteOffset = this._dataPtr + i * channelByteSize;
            let endByteOffset = startByteOffset + channelByteSize;
            this._channelData[i] =
                this._module.HEAPF32.subarray(startByteOffset >> BYTES_PER_UNIT,
                    endByteOffset >> BYTES_PER_UNIT);
        }
    }

    adaptChannel(newChannelCount) {
        if (newChannelCount < this._maxChannelCount) {
            this._channelCount = newChannelCount;
        }
    }


    get length() {
        return this._isInitialized ? this._length : null;
    }

    get numberOfChannels() {
        return this._isInitialized ? this._channelCount : null;
    }

    get maxChannelCount() {
        return this._isInitialized ? this._maxChannelCount : null;
    }

    getChannelData(channelIndex) {
        if (channelIndex >= this._channelCount) {
            return null;
        }

        return typeof channelIndex === 'undefined'
            ? this._channelData : this._channelData[channelIndex];
    }

    getF32Array() {
        return this._channelData[0];
    }

    getPointer() {
        return this._dataPtr;
    }

    free() {
        this._isInitialized = false;
        this._module._free(this._dataPtr);
        this._module._free(this._pointerArrayPtr);
        this._channelData = null;
    }
}

export default WASMAudioBuffer;
