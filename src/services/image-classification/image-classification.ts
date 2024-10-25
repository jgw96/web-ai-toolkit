import { pipeline, env } from '@huggingface/transformers';
import { webGPUCheck } from '../../utils';

let classifier: any = undefined;

export async function runClassifier(image: Blob | string, model: string = "onnx-community/mobilenetv4s-webnn") {
    return new Promise(async (resolve, reject) => {
        try {
            if (!classifier) {
                await loadClassifier(model);
            };

            if (typeof image !== "string") {
                image = URL.createObjectURL(image);
            }

            const out = await classifier(image);
            resolve(out);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function loadClassifier(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!classifier) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;

            classifier = await pipeline("image-classification", model || "Xenova/resnet-50", {
                device: (navigator as any).ml ? "webnn-npu" : await webGPUCheck() ? "webgpu" : "wasm"
            });
            console.log("loaded classifier", classifier)
            resolve();
        }
        else {
            resolve();
        }
    });
}