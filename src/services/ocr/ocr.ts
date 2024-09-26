// let ocrWorker: Worker;

// // @ts-ignore
// import OCRWorker from './ocr-worker?worker&inline';

// export async function loadOCR(model: string): Promise<void> {
//     return new Promise(async (resolve) => {
//         if (!ocrWorker) {
//             ocrWorker = new OCRWorker();
//         }

//         ocrWorker.onmessage = async (e) => {
//             if (e.data.type === "loaded") {
//                 resolve();
//             }
//         }

//         ocrWorker.postMessage({
//             type: "load",
//             model
//         });
//     });
// }

// export function doLocalOCR(blob: Blob) {
//     return new Promise((resolve, reject) => {
//         try {
//             ocrWorker.onmessage = async (e) => {
//                 if (e.data.type === "ocr") {
//                     resolve(e.data.text);
//                 }
//                 else if (e.data.type === "error") {
//                     reject(e.data.error);
//                 }
//             }

//             const dataURL = URL.createObjectURL(blob);

//             ocrWorker.postMessage({
//                 type: "ocr",
//                 blob: dataURL
//             });
//         }
//         catch (err) {
//             reject(err);
//         }
//     });
// }

/* eslint-disable no-async-promise-executor */
import { pipeline, env } from '@huggingface/transformers';

let ocr: any = undefined;

export async function runOCR(image: Blob, model: string = "Xenova/trocr-small-printed") {
    return new Promise(async (resolve) => {
        if (!ocr) {
            await loadOCR(model);
        }
        const out = await ocr(image);
        resolve(out);
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