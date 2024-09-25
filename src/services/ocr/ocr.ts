let ocrWorker: Worker;

export async function loadOCR(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!ocrWorker) {
            ocrWorker = new Worker(new URL('./ocr-worker.ts', import.meta.url), { type: 'module' });
        }

        ocrWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        ocrWorker.postMessage({
            type: "load",
            model
        });
    });
}

export function doLocalOCR(blob: Blob) {
    return new Promise((resolve, reject) => {
        try {
            ocrWorker.onmessage = async (e) => {
                if (e.data.type === "ocr") {
                    resolve(e.data.text);
                }
                else if (e.data.type === "error") {
                    reject(e.data.error);
                }
            }

            const dataURL = URL.createObjectURL(blob);

            ocrWorker.postMessage({
                type: "ocr",
                blob: dataURL
            });
        }
        catch (err) {
            reject(err);
        }
    });
}