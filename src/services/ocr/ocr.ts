let ocrWorker: Worker;

// @ts-ignore
import OCRWorker from './ocr-worker?worker&inline';

export async function loadOCR(): Promise<void> {
    return new Promise(async (resolve) => {
        if (!ocrWorker) {
          ocrWorker = new OCRWorker();
        }

        ocrWorker.onmessage = async (e) => {
            if (e.data.type === "loaded") {
                resolve();
            }
        }

        ocrWorker.postMessage({
            type: "load",
        });
    });
}

export function doLocalOCR(blob: Blob) {
    return new Promise((resolve) => {
        ocrWorker.onmessage = async (e) => {
            if (e.data.type === "ocr") {
                resolve(e.data.text);
            }
        }

        const dataURL = URL.createObjectURL(blob);

        ocrWorker.postMessage({
            type: "ocr",
            blob: dataURL
        });
    });
}