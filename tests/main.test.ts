import { expect, test } from 'vitest';

test('text-to-speech', async () => {
    return new Promise(async (resolve) => {
        const { textToSpeech } = await import("../src/index");

        const audio = await textToSpeech("Hello, World!");
        expect(audio).toBeDefined();

        resolve(true);
    });
});

test('speech-to-text', async () => {
    return new Promise(async (resolve) => {
        const { transcribeAudioFile } = await import("../src/index");

        const response = await fetch("https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60_16k.wav");
        const blob = await response.blob();

        const text = await transcribeAudioFile(blob);
        expect(text).toBeDefined();

        resolve(true);
    });
});

test('ocr', async () => {
    return new Promise(async (resolve) => {
        const { ocr } = await import("../src/index");

        const response = await fetch("https://picsum.photos/200/300");
        const blob = await response.blob();

        const text = await ocr(blob);

        expect(text).toBeDefined();
        resolve(true);
    });
});

test('image-classification', async () => {
    return new Promise(async (resolve) => {
        const { classifyImage } = await import("../src/index");

        const response = await fetch("https://picsum.photos/200/300");
        const blob = await response.blob();

        const text = await classifyImage(blob);

        expect(text).toBeDefined();
        resolve(true);
    });
});

test('summarize', async () => {
    return new Promise(async (resolve) => {
        const { summarize } = await import("../src/index");

        const text = "the red fox is a small fox that lives in the forest. it has a red coat and a bushy tail. the red fox is a carnivore, which means it eats meat. it hunts small animals like rabbits";
        const summary = await summarize(text);

        expect(summary).toBeDefined();
        resolve(true);
    });
});