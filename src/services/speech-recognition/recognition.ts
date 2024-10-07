/* eslint-disable no-async-promise-executor */
import { AutomaticSpeechRecognitionPipeline, pipeline, env } from '@huggingface/transformers';
import { webGPUCheck } from '../../utils';

let transcriber: AutomaticSpeechRecognitionPipeline | undefined = undefined;

export function doLocalWhisper(audioFile: Blob, model: string = "Xenova/whisper-tiny") {
    return new Promise(async (resolve, reject) => {
        try {
            if (!transcriber) {
                await loadTranscriber(model || 'Xenova/whisper-tiny', false, 'en');
            }
            
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

                const output = await localTranscribe(audio);
                resolve(output);



            };
            fileReader.readAsArrayBuffer(audioFile);
        }
        catch (err) {
            reject(err);
        }
    })
}

export async function loadTranscriber(model: string = "Xenova/whisper-tiny", timestamps: boolean, language: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!transcriber) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            transcriber = await pipeline('automatic-speech-recognition', model || 'Xenova/whisper-tiny', {
                // @ts-ignore
                return_timestamps: timestamps,
                language,
                device: (navigator as any).ml ? "webnn" : await webGPUCheck() ? "webgpu" : "wasm"
            });

            resolve();
        }
        else {
            resolve();
        }
    })
}

export async function localTranscribe(audio: Float32Array): Promise<string> {
    return new Promise(async (resolve, reject) => {
        if (transcriber) {
            // @ts-ignore
            const output = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                // @ts-ignore
                callback_function: callback_function, // after each generation step
                chunk_callback: chunk_callback, // after each chunk is processed
            });

            // @ts-ignore
            resolve(output.text);
        }
        else {
            reject();
        }
    })
}

// Storage for chunks to be processed. Initialise with an empty chunk.
const chunks_to_process = [
    {
        tokens: [],
        finalised: false,
    },
];

// TODO: Storage for fully-processed and merged chunks
// let decoded_chunks = [];

function chunk_callback(chunk: any) {
    const last = chunks_to_process[chunks_to_process.length - 1];

    // Overwrite last chunk with new info
    Object.assign(last, chunk);
    last.finalised = true;

    // Create an empty chunk after, if it not the last chunk
    if (!chunk.is_last) {
        chunks_to_process.push({
            tokens: [],
            finalised: false,
        });
    }
}

// Inject custom callback function to handle merging of chunks
function callback_function(item: any) {
    // @ts-ignore
    const time_precision = transcriber!.processor.feature_extractor.config.chunk_length / transcriber!.model.config.max_source_positions;

    const last: any = chunks_to_process[chunks_to_process.length - 1];

    // Update tokens of last chunk
    last.tokens = [...item[0].output_token_ids];

    console.log("callback_function", item, last)

    // Merge text chunks
    // TODO optimise so we don't have to decode all chunks every time
    // @ts-ignore
    const data = transcriber!.tokenizer._decode_asr(chunks_to_process, {
        time_precision: time_precision,
        return_timestamps: true,
        force_full_sequences: false,
    });

    console.log("callback_function", data);

    self.postMessage({
        type: 'transcribe-interim',
        transcription: data[0]
    });
}