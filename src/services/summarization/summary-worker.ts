/* eslint-disable no-async-promise-executor */
import { pipeline, env } from '@xenova/transformers';

let summarizer: any = undefined;

self.onmessage = async (e) => {
    if (e.data.type === 'summarize') {
        return new Promise((resolve) => {
            console.log("in worker", e.data)
            runSummarizer(e.data.text).then((summaryData: any) => {
                self.postMessage({
                    type: 'summarize',
                    summary: summaryData
                });
                resolve(summaryData);
            })
        })
    }
    else if (e.data.type === "load") {
        return new Promise(async (resolve) => {
            await loadSummarizer();

            self.postMessage({
                type: 'loaded'
            });
            resolve(summarizer);
        });
    }
    else {
        return Promise.reject('Unknown message type');
    }
}

async function runSummarizer(text: string) {
    return new Promise(async (resolve) => {
        const out = await summarizer(text);
        resolve(out);
    });
}

async function loadSummarizer(): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summarizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
            console.log("loaded summarizer", summarizer)
            resolve();
        }
        else {
            resolve();
        }
    });
}