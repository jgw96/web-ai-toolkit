import { KokoroTTS } from "kokoro-js";

let synthesizer: any = undefined;

export async function runSynthesizer(text: string) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!synthesizer) {
        await loadSynthesizer();
      };
      const out = await synthesizer.generate(text, {
        // Use `tts.list_voices()` to list all available voices
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
    const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: "fp32", // Options: "fp32", "fp16", "q8", "q4", "q4f16"
      device: "webgpu", // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
    });

    synthesizer = tts;

    resolve(synthesizer);
  })
}