/* eslint-disable no-async-promise-executor */
// @ts-ignore
import { pipeline, env } from '@xenova/transformers';
import { session_options } from '../../utils';

let synthesizer: any = undefined;

self.onmessage = async (e) => {
    if (e.data.type === 'text-to-speech') {
        return new Promise((resolve) => {
            console.log("in worker", e.data)
            runSynthesizer(e.data.text).then((audioData: any) => {
                self.postMessage({
                    type: 'synthesizer',
                    audio: audioData.audio
                });
                resolve(audioData.audio);
            })
        })
    }
    else if (e.data.type === "load") {
        return new Promise(async (resolve) => {
            await loadSynthesizer(e.data.model);

            self.postMessage({
                type: 'loaded'
            });
            resolve(synthesizer);
        });
    }
    else {
        return Promise.reject('Unknown message type');
    }
}

async function runSynthesizer(text: string) {
    return new Promise(async (resolve) => {
        console.log("synthesizer", synthesizer, text)
        const out = await synthesizer(text);
        resolve(out);
    });
}

async function loadSynthesizer(model: string): Promise<void> {
    console.log("loading synthesizer", synthesizer)
    return new Promise(async (resolve) => {
        if (!synthesizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            synthesizer = await pipeline('text-to-speech', model || 'Xenova/mms-tts-eng', {
                session_options
            });
            console.log("loaded synthesizer", synthesizer)
            resolve();
        }
        else {
            resolve();
        }
    });
}