import { pipeline, env } from '@huggingface/transformers';
import { webGPUCheck } from '../../utils';
import { processChunkedSummarization, splitTextIntoChunks } from './summarization-utils';

let summarizer: any = undefined;

export async function runSummarizer(
    text: string, 
    model: string = "Xenova/distilbart-cnn-6-6", 
    maxChunkLength: number = 1000, 
    overlap: number = 100, 
    minChunkLength: number = 200,
    onProgress?: (progress: number, message: string) => void,
    maxConcurrency: number = 1 // Set to 1 for HuggingFace models to avoid concurrent access issues
) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!summarizer) {
                await loadSummarizer(model);
            }

            // If text is short enough, summarize directly without chunking
            if (text.length <= maxChunkLength) {
                const result = await summarizer(text);
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
                    return await summarizer(chunk);
                },
                (summary: any) => {
                    return Array.isArray(summary) ? summary[0].summary_text : summary.summary_text;
                },
                (combinedText: string) => {
                    return [{ summary_text: combinedText }];
                },
                maxConcurrency
            );

            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
}

async function loadSummarizer(model: string): Promise<void> {
    return new Promise(async (resolve) => {
        if (!summarizer) {
            env.allowLocalModels = false;
            env.useBrowserCache = false;

            summarizer = await pipeline('summarization', model || 'Xenova/distilbart-cnn-6-6', {
                dtype: "fp32",
                device: (navigator as any).ml ? "webnn" : await webGPUCheck() ? "webgpu" : "wasm"
            });

            resolve();
        }
        else {
            resolve();
        }
    });
}


interface SummarizationOptions {
    model?: string;
    maxChunkLength?: number;
    overlap?: number;
    minChunkLength?: number;
    maxConcurrency?: number;
    onProgress?: (progress: number, message: string) => void;
}

export async function runSummarizerWithOptions(text: string, options: SummarizationOptions = {}) {
    const {
        model = "Xenova/distilbart-cnn-6-6",
        maxChunkLength = 1000,
        overlap = 100,
        minChunkLength = 200,
        maxConcurrency = 1, // Sequential processing for HuggingFace models
        onProgress
    } = options;

    return runSummarizer(text, model, maxChunkLength, overlap, minChunkLength, onProgress, maxConcurrency);
}

/**
 * Enhanced summarization function that handles very long text by using hierarchical summarization
 * @param text The text to summarize
 * @param options Configuration options for summarization
 * @returns Promise resolving to the summary
 */
export async function summarizeLongText(text: string, options: SummarizationOptions = {}) {
    const {
        model = "Xenova/distilbart-cnn-6-6",
        maxChunkLength = 1000,
        overlap = 100,
        minChunkLength = 200,
        maxConcurrency = 1, // Sequential processing for HuggingFace models
        onProgress
    } = options;

    // For very long texts, use hierarchical approach
    if (text.length > maxChunkLength * 10) {
        return hierarchicalSummarization(text, model, maxChunkLength, overlap, minChunkLength, onProgress, maxConcurrency);
    } else {
        return runSummarizer(text, model, maxChunkLength, overlap, minChunkLength, onProgress, maxConcurrency);
    }
}

/**
 * Hierarchical summarization for extremely long documents
 */
async function hierarchicalSummarization(
    text: string, 
    model: string, 
    maxChunkLength: number, 
    overlap: number, 
    minChunkLength: number,
    onProgress?: (progress: number, message: string) => void,
    maxConcurrency: number = 1 // Sequential processing for HuggingFace models
): Promise<any> {
    if (!summarizer) {
        await loadSummarizer(model);
    }

    onProgress?.(0, 'Starting hierarchical summarization...');

    // Level 1: Split into large sections
    const largeChunks = splitTextIntoChunks(text, maxChunkLength * 5, overlap * 2, minChunkLength * 2);
    
    onProgress?.(0.1, `Processing ${largeChunks.length} large sections...`);
    
    // Level 2: Summarize each large section
    const sectionSummaries = [];
    for (let i = 0; i < largeChunks.length; i++) {
        const chunk = largeChunks[i];
        const summary = await runSummarizer(chunk, model, maxChunkLength, overlap, minChunkLength, undefined, maxConcurrency) as any;
        const summaryText = Array.isArray(summary) ? summary[0].summary_text : summary.summary_text;
        sectionSummaries.push(summaryText);
        
        const progress = 0.1 + ((i + 1) / largeChunks.length) * 0.8; // 10-90% for section processing
        onProgress?.(progress, `Processed section ${i + 1} of ${largeChunks.length}`);
    }

    onProgress?.(0.95, 'Combining section summaries...');

    // Level 3: Just combine all section summaries and return
    const combinedSummaries = sectionSummaries.join(' ');
    
    onProgress?.(1.0, 'Hierarchical summarization complete!');
    return [{ summary_text: combinedSummaries }];
}