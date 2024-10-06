/* eslint-disable no-async-promise-executor */
import { pipeline, env } from '@huggingface/transformers';

let ocr: any = undefined;

export async function runOCR(image: Blob | string, model: string = "Xenova/trocr-small-printed") {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ocr) {
                await loadOCR(model);
            }
    
            if (typeof image !== "string") {
                image = URL.createObjectURL(image);
            }
    
            const out = await ocr(image);
            resolve(out);
        }
        catch(err) {
            reject(err);
        }
    });
}

async function loadOCR(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!ocr) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            ocr = await pipeline('image-to-text', model || 'Xenova/trocr-small-printed', {
                device: (navigator as any).ml ? "webnn" : "webgpu"
            });
            console.log("loaded ocr", ocr)
            resolve();
        }
        else {
            resolve();
        }
    });
}