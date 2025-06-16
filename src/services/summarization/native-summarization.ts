import { processChunkedSummarization } from './summarization-utils';

interface SummarizerOptions {
    sharedContext: string;
    type: "tldr" | "key-points" | "teaser" | "headline";
    format: "markdown" | "plain-text";
    length: "short" | "medium" | "long";
}

let currentSummarizer: any;

export async function runNativeSummarizer(
    text: string, 
    userOptions?: Partial<SummarizerOptions>,
    maxChunkLength: number = 1000,
    overlap: number = 100,
    minChunkLength: number = 200,
    onProgress?: (progress: number, message: string) => void,
    maxConcurrency: number = 3
) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!('Summarizer' in self)) {
                throw new Error('Summarizer API is not available in this environment.');
            }

            const options: SummarizerOptions = {
                sharedContext: userOptions?.sharedContext || '',
                type: userOptions?.type || 'tldr',
                format: userOptions?.format || 'markdown',
                length: userOptions?.length || 'medium'
            };

            const summarizer = await loadNativeSummarizer(options);
            if (!summarizer) {
                throw new Error('Failed to load the Summarizer API.');
            }

            currentSummarizer = summarizer;

            // If text is short enough, summarize directly without chunking
            if (text.length <= maxChunkLength) {
                const result = await summarizer.summarize(text);
                resolve(result);
                return;
            }

            // For long text, use chunked processing
            const result = await processChunkedSummarization(
                text,
                maxChunkLength,
                overlap,
                minChunkLength,
                onProgress,
                async (chunk: string) => {
                    return await summarizer.summarize(chunk);
                },
                (summary: string) => {
                    return summary; // Native summarizer returns strings directly
                },
                (combinedText: string) => {
                    return combinedText; // Native summarizer returns strings directly
                },
                maxConcurrency
            );

            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

async function loadNativeSummarizer(options: SummarizerOptions) {
    if (currentSummarizer) {
        // If the Summarizer API is already loaded, return it.
        return currentSummarizer;
    }

    // @ts-ignore
    const availability = await Summarizer.availability();
    let summarizer;
    if (availability === 'unavailable') {
        // The Summarizer API isn't usable.
        return;
    }
    if (availability === 'available') {
        // The Summarizer API can be used immediately .
        // @ts-ignore
        summarizer = await Summarizer.create(options);
        currentSummarizer = summarizer;
    } else {
        // The Summarizer API can be used after the model is downloaded.
        // @ts-ignore
        summarizer = await Summarizer.create(options);
        summarizer.addEventListener('downloadprogress', (e: any) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
        });

        currentSummarizer = summarizer;
        await summarizer.ready;
    }

    return currentSummarizer;
}