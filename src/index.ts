export async function transcribeAudioFile(audioFile: Blob, model = 'Xenova/whisper-tiny', timestamps = false, language = 'en-US') {
  try {
    const { loadTranscriber, doLocalWhisper } = await import('./services/speech-recognition/recognition');
    await loadTranscriber(model, timestamps, language);
    return doLocalWhisper(audioFile, model);
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

export async function textToSpeech(text: string) {
  try {
    const { runSynthesizer } = await import('./services/text-to-speech/tts');
    return runSynthesizer(text);
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

export async function summarize(text: string, options: any = {}) {
  try {
    if ('Summarizer' in self && !options.model) {
      const { runNativeSummarizer } = await import('./services/summarization/native-summarization');
      const {
        maxChunkLength = 1000,
        overlap = 100,
        minChunkLength = 200,
        onProgress,
        ...summarizerOptions
      } = options;
      return runNativeSummarizer(text, summarizerOptions, maxChunkLength, overlap, minChunkLength, onProgress);
    }
    else {
      const { runSummarizer } = await import('./services/summarization/summarization');
      const {
        model = 'Xenova/distilbart-cnn-6-6',
        maxChunkLength = 1000,
        overlap = 100,
        minChunkLength = 200,
        onProgress,
      } = options;
      return runSummarizer(text, model, maxChunkLength, overlap, minChunkLength, onProgress);
    }
  }
  catch (err) {
    console.error(err);
    return err;
  }
}



export async function ocr(image: Blob, model = 'Xenova/trocr-small-printed') {
  try {
    const { runOCR } = await import('./services/ocr/ocr');
    return runOCR(image, model);
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

export async function classifyImage(image: Blob, model: string = "Xenova/resnet-50") {
  try {
    const { runClassifier } = await import("./services/image-classification/image-classification");
    return runClassifier(image, model);
  }
  catch (err) {
    console.error(err);
    return err;
  }
}

export async function doRAGSearch(texts: string[], query: string) {
  try {
    const { simpleRAG } = await import("./services/rag/rag");
    return simpleRAG(texts, query);
  }
  catch (err) {
    console.error(err);
    return err;
  }
}