import { expect, test } from 'vitest';

test('speech-to-text', async () => {
    return new Promise(async (resolve) => {
        const { transcribeAudioFile } = await import("../src/index");

        const input = document.createElement("button");

        input.onclick = async (e) => {
            const response = await fetch("https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60_16k.wav");
            const blob = await response.blob();

            const text = await transcribeAudioFile(blob);
            console.log(text);
            expect(text).toBeDefined();

            resolve(true);
        };

        document.body.appendChild(input);
    });
});

test('ocr', async () => {
    return new Promise(async (resolve) => {
        const { ocr } = await import("../src/index");

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (e) => {
            const file = (e.target as any).files[0];
            const text = await ocr(URL.createObjectURL(file) as any);

            expect(text).toBeDefined();
            resolve(true);
        };

        document.body.appendChild(input);
    });
});