import { pipeline, env } from '@huggingface/transformers';

let summarizer: any = undefined;

export async function runSummarizer(text: string, model: string = "Xenova/distilbart-cnn-6-6") {
    return new Promise(async (resolve) => {
        if (!summarizer) {
            await loadSummarizer(model);
        };

        const out = await summarizer(text);
        resolve(out);
    });
}

async function loadSummarizer(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summarizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;

            summarizer = await pipeline('summarization', model || 'Xenova/distilbart-cnn-6-6', {
                dtype: "fp32",
                device: (navigator as any).ml ? "webnn" : "webgpu"
            });
            console.log("loaded summarizer", summarizer)
            resolve();
        }
        else {
            resolve();
        }
    });
}