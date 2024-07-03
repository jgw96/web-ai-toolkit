let summaryWorker: Worker;

// @ts-ignore
import SummaryWorker from './summary-worker?worker&inline';

export async function loadSummarizer(): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summaryWorker) {
          summaryWorker = new SummaryWorker();
        }

        summaryWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        summaryWorker.postMessage({
            type: "load",
        });
    });
}

export function doLocalSummarize(text: string) {
    return new Promise((resolve) => {
        summaryWorker.onmessage = async (e) => {
            if (e.data.type === "summarize") {
                resolve(e.data.summary);
            }
        }

        summaryWorker.postMessage({
            type: "summarize",
            text
        });
    });
}