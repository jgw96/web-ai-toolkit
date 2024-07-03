let ttsWorker: Worker;

// @ts-ignore
import TTSWorker from './tts-worker?worker&inline';

export async function loadTTS(): Promise<void> {
    return new Promise(async (resolve) => {
        if (!ttsWorker) {
          ttsWorker = new TTSWorker();
        }

        ttsWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        ttsWorker.postMessage({
            type: "load",
        });
    });
}

export function doLocalTTS(text: string) {
    return new Promise((resolve) => {
        ttsWorker.onmessage = async (e) => {
            if (e.data.type === "synthesizer") {
                resolve(e.data.audio);
            }
        }

        ttsWorker.postMessage({
            type: "text-to-speech",
            text
        });
    });
}