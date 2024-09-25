let summaryWorker: Worker;

export async function loadSummarizer(model: string = "Xenova/distilbart-cnn-6-6"): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summaryWorker) {
            summaryWorker = new Worker(new URL('./summary-worker.ts', import.meta.url), { type: 'module' });
        }

        summaryWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        summaryWorker.postMessage({
            type: "load",
            model
        });
    });
}

export function doLocalSummarize(text: string) {
    return new Promise((resolve, reject) => {
        try {
            summaryWorker.onmessage = async (e) => {
                if (e.data.type === "summarize") {
                    resolve(e.data.summary);
                }
                else if (e.data.type === "error") {
                    reject(e.data.error);
                }
            }

            summaryWorker.postMessage({
                type: "summarize",
                text
            });
        }
        catch (err) {
            reject(err);
        }
    });
}