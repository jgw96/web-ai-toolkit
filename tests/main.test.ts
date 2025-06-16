import { expect, test } from 'vitest';

// test('text-to-speech', async () => {
//     return new Promise(async (resolve) => {
//         const { textToSpeech } = await import("../src/index");

//         const audio = await textToSpeech("Hello, World!");
//         expect(audio).toBeDefined();

//         resolve(true);
//     });
// });

// test('speech-to-text', async () => {
//     return new Promise(async (resolve) => {
//         const { transcribeAudioFile } = await import("../src/index");

//         const response = await fetch("https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/ted_60_16k.wav");
//         const blob = await response.blob();

//         const text = await transcribeAudioFile(blob);
//         expect(text).toBeDefined();

//         resolve(true);
//     });
// });

// test('ocr', async () => {
//     return new Promise(async (resolve) => {
//         const { ocr } = await import("../src/index");

//         const response = await fetch("https://picsum.photos/200/300");
//         const blob = await response.blob();

//         const text = await ocr(blob);

//         expect(text).toBeDefined();
//         resolve(true);
//     });
// });

// test('image-classification', async () => {
//     return new Promise(async (resolve) => {
//         const { classifyImage } = await import("../src/index");

//         const response = await fetch("https://picsum.photos/200/300");
//         const blob = await response.blob();

//         const text = await classifyImage(blob);

//         expect(text).toBeDefined();
//         resolve(true);
//     });
// });

test('summarize', async () => {
    return new Promise(async (resolve) => {
        const { summarize } = await import("../src/index");

        const text = "the red fox is a small fox that lives in the forest. it has a red coat and a bushy tail. the red fox is a carnivore, which means it eats meat. it hunts small animals like rabbits";
        const summary = await summarize(text);

        expect(summary).toBeDefined();
        resolve(true);
    });
});

test('summarize-long-text', async () => {
    return new Promise(async (resolve) => {
        const { summarize } = await import("../src/index");

        // Create a long text by repeating a paragraph
        const paragraph = "The red fox is a small to medium-sized mammal that belongs to the Canidae family. It is native to the Northern Hemisphere and is the most widespread species of fox. Red foxes are known for their distinctive reddish-orange fur, white chest and belly, and black legs and ears. They have a bushy tail with a white tip, which is often called a 'brush.' These adaptable creatures can be found in various habitats, including forests, grasslands, mountains, and deserts. They are omnivores with a diet that includes small mammals, birds, insects, fruits, and vegetables. Red foxes are solitary animals that are most active during dawn and dusk. They are known for their intelligence and cunning behavior, which has made them a popular subject in folklore and literature. ";
        
        const longText = Array(20).fill(paragraph).join(' '); // Create a very long text

        const summary = await summarize(longText, {
            maxChunkLength: 500,
            onProgress: (progress, message) => {
                console.log(`Progress: ${Math.round(progress * 100)}% - ${message}`);
            }
        });

        expect(summary).toBeDefined();
        expect(Array.isArray(summary) ? summary[0].summary_text : summary.summary_text).toBeDefined();
        console.log('Long text summary:', Array.isArray(summary) ? summary[0].summary_text : summary.summary_text);
        
        resolve(true);
    });
}, 60000); // 60 second timeout for long text