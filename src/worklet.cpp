#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#endif
#include <math.h>

#ifdef __EMSCRIPTEN__
using namespace emscripten;
#endif

const size_t kRenderQuantumFrames = 128;
const size_t kBytesPerChannel = kRenderQuantumFrames * sizeof(float); 


class BasicProcessor
{
    unsigned long long sample;
    float frequency;
public:
    BasicProcessor(float frequency = 440.0) : frequency(frequency) {
        sample = 0;
    };

    void process(uintptr_t output_ptr)
    {
        float *output_buffer = reinterpret_cast<float *>(output_ptr);

        float *destination = output_buffer + 0 * kRenderQuantumFrames;
        
        for (size_t i = 0; i < kRenderQuantumFrames; i++) {
            destination[i] = sin(2.0 * 3.1415 * this->frequency * sample / 48000);
            sample++;
            if (sample >= 48000) sample = 0;
        }
        
    }
};

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(CLASS_BasicProcessor) {
  class_<BasicProcessor>("BasicProcessorWASM")
      .constructor()
      .constructor<float>()
      .function("process",
                &BasicProcessor::process,
                allow_raw_pointers());
}
#endif