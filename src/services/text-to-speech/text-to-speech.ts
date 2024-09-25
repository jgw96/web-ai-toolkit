let ttsWorker: Worker;

export async function loadTTS(model: string = "Xenova/mms-tts-eng"): Promise<void> {
    return new Promise(async (resolve) => {
        if (!ttsWorker) {
          ttsWorker = new Worker(new URL('./tts-worker.ts', import.meta.url), { type: 'module' });
        }

        ttsWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        ttsWorker.postMessage({
            type: "load",
            model
        });
    });
}

export function doLocalTTS(text: string) {
    return new Promise((resolve, reject) => {
        try {
            ttsWorker.onmessage = async (e) => {
                if (e.data.type === "synthesizer") {
                    resolve(e.data.audio);
                }
                else if (e.data.type === "error") {
                    reject(e.data.error);
                }
            }
    
            ttsWorker.postMessage({
                type: "text-to-speech",
                text
            });
        }
        catch (err) {
            reject(err);
        }
    });
}