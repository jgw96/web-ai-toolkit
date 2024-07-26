/* eslint-disable no-async-promise-executor */
// @ts-ignore
import { AutomaticSpeechRecognitionPipeline, pipeline, env } from '@xenova/transformers';

let transcriber: AutomaticSpeechRecognitionPipeline | undefined = undefined;

self.onmessage = async (e) => {
    if (e.data.type === 'transcribe') {
        return new Promise((resolve) => {
            console.log("in worker", e.data)
            localTranscribe(e.data.blob).then((transcription) => {
                console.log("in worker", transcription)
                self.postMessage({
                    type: 'transcribe',
                    transcription: transcription
                });
                resolve(transcription);
            })
        })
    }
    else if (e.data.type === "load") {
        await loadTranscriber(e.data.model || 'Xenova/whisper-tiny', e.data.timestamps, e.data.language);
        self.postMessage({
            type: 'loaded'
        });
        return Promise.resolve();
    }
    else {
        return Promise.reject('Unknown message type');
    }
}

export async function loadTranscriber(model: string = "Xenova/whisper-tiny", timestamps: boolean, language: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!transcriber) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            transcriber = await pipeline('automatic-speech-recognition', model || 'Xenova/whisper-tiny', {
                // @ts-ignore
                return_timestamps: timestamps,
                language
            });

            resolve();
        }
        else {
            resolve();
        }
    })
}

export async function localTranscribe(audio: Blob): Promise<string> {
    return new Promise(async (resolve, reject) => {
        if (transcriber) {
            // @ts-ignore
            const output = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
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
    const time_precision =
        transcriber!.processor.feature_extractor.config.chunk_length /
        transcriber!.model.config.max_source_positions;

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