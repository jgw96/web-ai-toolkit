import { KokoroTTS } from "kokoro-js";
import { webGPUCheck } from "../../utils";

let synthesizer: any = undefined;

export async function runSynthesizer(text: string) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!synthesizer) {
        await loadSynthesizer();
      };
      const out = await synthesizer.generate(text, {
        voice: "af_heart",
      });

      resolve(out);
    }
    catch (err) {
      reject(err);
    }
  });
}

export async function loadSynthesizer() {
  return new Promise(async (resolve) => {
    const gpuCheck = await webGPUCheck();

    const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: gpuCheck ? "fp32" : "q8",
      device: gpuCheck ? "webgpu" : "wasm",
    });

    synthesizer = tts;

    resolve(synthesizer);
  })
}