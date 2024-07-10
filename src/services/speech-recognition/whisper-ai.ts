let whisperWorker: Worker;

// @ts-ignore
import WhisperWorker from './worker?worker&inline'

export async function loadTranscriber(model: string = "Xenova/whisper-tiny", timestamps: boolean, language: string): Promise<void> {
    return new Promise(async (resolve) => {
        whisperWorker = new WhisperWorker();

        whisperWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        whisperWorker.postMessage({
            type: "load",
            model,
            timestamps,
            language
        });
    });
}

export function doLocalWhisper(audioFile: Blob, model: string = "Xenova/whisper-tiny") {
    return new Promise((resolve, reject) => {
        try {
            const fileReader = new FileReader();
            fileReader.onloadend = async () => {
                const audioCTX = new AudioContext({
                    sampleRate: 16000,
                });
                const arrayBuffer = fileReader.result as ArrayBuffer;
                const audioData = await audioCTX.decodeAudioData(arrayBuffer);

                let audio;
                if (audioData.numberOfChannels === 2) {
                    const SCALING_FACTOR = Math.sqrt(2);

                    const left = audioData.getChannelData(0);
                    const right = audioData.getChannelData(1);

                    audio = new Float32Array(left.length);
                    for (let i = 0; i < audioData.length; ++i) {
                        audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
                    }
                } else {
                    // If the audio is not stereo, we can just use the first channel:
                    audio = audioData.getChannelData(0);
                }

                whisperWorker.onmessage = async (e) => {
                    if (e.data.type === "transcribe") {
                        console.log("e.data.transcript", e.data.transcription)

                        resolve(e.data);
                    }
                    else if (e.data.type === "transcribe-interim") {
                        window.dispatchEvent(new CustomEvent('interim-transcription', {
                            detail: {
                                message: e.data.transcription
                            }
                        }));
                    }
                    else if (e.data.type === "error") {
                        reject(e.data.error);
                    }
                }

                whisperWorker.postMessage({
                    type: "transcribe",
                    blob: audio,
                    model: model || "Xenova/whisper-tiny",
                })

            };
            fileReader.readAsArrayBuffer(audioFile);
        }
        catch (err) {
            reject(err);
        }
    })
}