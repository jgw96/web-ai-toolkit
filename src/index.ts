export async function transcribeAudioFile(audioFile: Blob, model: "tiny" | "base", timestamps: boolean = false, language: string = "en-US") {
    try {
        const { loadTranscriber, doLocalWhisper } = await import("./services/speech-recognition/whisper-ai");
        await loadTranscriber(model, timestamps, language);
        return doLocalWhisper(audioFile, model);
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export async function textToSpeech(text: string, model: string = "Xenova/mms-tts-eng") {
    try {
        const { loadTTS, doLocalTTS } = await import("./services/text-to-speech/text-to-speech");
        await loadTTS(model);
        return doLocalTTS(text);
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export async function summarize(text: string, model: string = "Xenova/distilbart-cnn-6-6") {
    try {
        const { loadSummarizer, doLocalSummarize } = await import("./services/summarization/summarization");
        await loadSummarizer(model);
        return doLocalSummarize(text);
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export async function ocr(image: Blob, model: string = "Xenova/trocr-small-printed") {
    try {
        const { loadOCR, doLocalOCR } = await import("./services/ocr/ocr");
        await loadOCR(model);
        return doLocalOCR(image);
    }
    catch (err) {
        console.error(err);
        return err;
    }
}
