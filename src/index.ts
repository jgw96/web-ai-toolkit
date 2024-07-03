export async function transcribeAudioFile(audioFile: Blob, model: "tiny" | "base", timestamps: boolean = false, language: string = "en-US") {
    const { loadTranscriber, doLocalWhisper } = await import("./services/speech-recognition/whisper-ai");
    await loadTranscriber(model, timestamps, language);
    return doLocalWhisper(audioFile, model);
}

export async function textToSpeech(text: string) {
    const { loadTTS, doLocalTTS } = await import("./services/text-to-speech/text-to-speech");
    await loadTTS();
    return doLocalTTS(text);
}

export async function summarize(text: string) {
    const { loadSummarizer, doLocalSummarize } = await import("./services/summarization/summarization");
    await loadSummarizer();
    return doLocalSummarize(text);
}

export async function ocr(image: Blob) {
    const { loadOCR, doLocalOCR } = await import("./services/ocr/ocr");
    await loadOCR();
    return doLocalOCR(image);
}
