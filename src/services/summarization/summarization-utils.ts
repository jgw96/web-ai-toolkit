/**
 * Shared utilities for summarization services
 */

export function splitTextIntoChunks(text: string, maxChunkLength: number, overlap: number, minChunkLength: number): string[] {
  // If text is shorter than max length, return as single chunk
  if (text.length <= maxChunkLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentPosition = 0;

  while (currentPosition < text.length) {
    const chunkEnd = currentPosition + maxChunkLength;
        
    // If we're at the end of the text, take the rest
    if (chunkEnd >= text.length) {
      const remainingText = text.substring(currentPosition).trim();
      if (remainingText.length >= minChunkLength || chunks.length === 0) {
        chunks.push(remainingText);
      } else if (chunks.length > 0) {
        // Merge with previous chunk if remaining text is too short
        chunks[chunks.length - 1] += ' ' + remainingText;
      }
      break;
    }

    // Try to find a good breaking point (sentence end, then paragraph, then space)
    let breakPoint = chunkEnd;
        
    // Look backwards for sentence endings
    for (let i = chunkEnd; i > currentPosition + Math.min(minChunkLength, maxChunkLength * 0.5); i--) {
      if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
        // Check if it's followed by whitespace or end of text, and not likely an abbreviation
        if (i + 1 >= text.length || /\s/.test(text[i + 1])) {
          // Simple check to avoid breaking on abbreviations like "Mr.", "Dr.", etc.
          const beforePeriod = text.substring(Math.max(0, i - 10), i);
          if (!(text[i] === '.' && /\b[A-Z][a-z]?$/.test(beforePeriod.trim()))) {
            breakPoint = i + 1;
            break;
          }
        }
      }
    }

    // If no sentence break found, look for paragraph breaks
    if (breakPoint === chunkEnd) {
      for (let i = chunkEnd; i > currentPosition + Math.min(minChunkLength, maxChunkLength * 0.5); i--) {
        if (text[i] === '\n' && (i + 1 < text.length && text[i + 1] === '\n')) {
          breakPoint = i + 2;
          break;
        }
      }
    }

    // If no paragraph break found, look for any whitespace
    if (breakPoint === chunkEnd) {
      for (let i = chunkEnd; i > currentPosition + Math.min(minChunkLength, maxChunkLength * 0.5); i--) {
        if (/\s/.test(text[i])) {
          breakPoint = i + 1;
          break;
        }
      }
    }

    // Extract the chunk and trim whitespace
    const chunk = text.substring(currentPosition, breakPoint).trim();
    if (chunk.length >= minChunkLength || chunks.length === 0) {
      chunks.push(chunk);
    } else if (chunks.length > 0) {
      // Merge with previous chunk if current chunk is too short
      chunks[chunks.length - 1] += ' ' + chunk;
    }

    // Move position forward, accounting for overlap but ensuring progress
    const nextPosition = Math.max(breakPoint - overlap, currentPosition + 1);
    currentPosition = nextPosition;
  }

  // Filter out any chunks that are too short or empty
  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Generic chunked summarization function - assumes text is already long enough to need chunking
 */
export async function processChunkedSummarization<T>(
  text: string,
  maxChunkLength: number,
  overlap: number,
  minChunkLength: number,
  onProgress: ((progress: number, message: string) => void) | undefined,
  summarizeFunction: (chunk: string) => Promise<T>,
  extractTextFunction: (summary: T) => string,
  createReturnValue: (combinedText: string) => T,
): Promise<T> {
  // Split text into chunks and summarize
  const chunks = splitTextIntoChunks(text, maxChunkLength, overlap, minChunkLength);
  const chunkSummaries: string[] = [];

  onProgress?.(0, `Processing ${chunks.length} chunks...`);

  // Process chunks sequentially
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const summary = await summarizeFunction(chunk);
    chunkSummaries.push(extractTextFunction(summary));
        
    const progress = ((i + 1) / chunks.length) * 0.9;
    onProgress?.(progress, `Processed ${i + 1} of ${chunks.length} chunks`);
  }

  // Combine all summaries and return in the expected format
  onProgress?.(0.95, 'Combining summaries...');
  const combinedSummary = chunkSummaries.join(' ');
    
  onProgress?.(1.0, 'Summarization complete!');
    
  // Return the combined summary in the expected format
  return createReturnValue(combinedSummary);
}
