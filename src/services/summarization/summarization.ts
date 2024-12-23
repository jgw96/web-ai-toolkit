import { pipeline, env } from '@huggingface/transformers';
import { webGPUCheck } from '../../utils';

let summarizer: any = undefined;

export async function runSummarizer(text: string, model: string = "Xenova/distilbart-cnn-6-6") {
    return new Promise(async (resolve, reject) => {
        try {
            if (!summarizer) {
                await loadSummarizer(model);
            };

            const out = await summarizer(text);
            resolve(out);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function loadSummarizer(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summarizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;

            summarizer = await pipeline('summarization', model || 'Xenova/distilbart-cnn-6-6', {
                dtype: "fp32",
                device: (navigator as any).ml ? "webnn" : await webGPUCheck() ? "webgpu" : "wasm"
            });

            resolve();
        }
        else {
            resolve();
        }
    });
}