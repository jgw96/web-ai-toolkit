export async function transcribeAudioFile(audioFile: Blob, model: string = "Xenova/whisper-tiny", timestamps: boolean = false, language: string = "en-US") {
    try {
        const { loadTranscriber, doLocalWhisper } = await import("./services/speech-recognition/recognition");
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
        const { runSynthesizer } = await import("./services/text-to-speech/tts");
        return runSynthesizer(text, model);
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export async function summarize(text: string) {
    try {
        if ('Summarizer' in self) {
            const { runNativeSummarizer } = await import("./services/summarization/native-summarization");
            return runNativeSummarizer(text);
        }
        else {
            const { runSummarizer } = await import("./services/summarization/summarization");
            return runSummarizer(text);
        }
    }
    catch (err) {
        console.error(err);
        return err;
    }
}

export async function ocr(image: Blob, model: string = "Xenova/trocr-small-printed") {
    try {
        const { runOCR } = await import("./services/ocr/ocr");
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