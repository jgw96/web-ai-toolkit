/* eslint-disable no-async-promise-executor */
import { pipeline, env } from '@huggingface/transformers';

let synthesizer: any = undefined;

export async function runSynthesizer(text: string, model: string = "Xenova/mms-tts-eng") {
    return new Promise(async (resolve, reject) => {
        try {
            if (!synthesizer) {
                await loadSynthesizer(model);
            };
            const out = await synthesizer(text);
            resolve(out);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function loadSynthesizer(model: string): Promise<void> {
    console.log("loading synthesizer", synthesizer)
    return new Promise(async (resolve) => {
        if (!synthesizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            synthesizer = await pipeline('text-to-speech', model || 'Xenova/mms-tts-eng');
            console.log("loaded synthesizer", synthesizer)
            resolve();
        }
        else {
            resolve();
        }
    });
}