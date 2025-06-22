
# Web AI Toolkit

The Web AI Toolkit simplifies the integration of AI features, such as OCR, speech-to-text, text summarization and more into your application. It ensures data privacy and offline capability by running all AI workloads locally.

## Device Support

The functions the Web AI Toolkit provides will run on any device that supports WebGPU. Some of our APIs, such as the summarize function, will use the Built-In Summarizer API available in Chromium browsers when available, otherwise it will fall back to a WebGPU backend.

## Installation

To install the Web AI Toolkit, run:

```sh
npm install web-ai-toolkit
```

## Available Functions

*Note: Supported hardware is listed in priority of device selection. For example, for transcribing an audio file,
the code will attempt to choose the GPU first and then the CPU otherwise.*

| Function Name         | Parameter      | Type                   | Default Value | Supported Hardware |
|-----------------------|----------------|------------------------|---------------|--------------------|
| transcribeAudioFile   | audioFile      | Blob                   | -             | GPU              |
|                       | model          | string                 | "Xenova/whisper-tiny"|                    |
|                       | timestamps     | boolean                | false         |                    |
|                       | language       | string                 | "en-US"       |                    |
| textToSpeech          | text           | string                 | -             | GPU              |
|                       | model          | string                 | "Kokoro-js"|                    |
| summarize             | text           | string                 | -             | GPU              |
|                       | model          | string                 | "Xenova/distilbart-cnn-6-6"|                |
| ocr                   | image          | Blob                   | -             | GPU               |
|                       | model          | string                 | "Xenova/trocr-small-printed"|                 |
| classifyImage         | image          | Blob                   | -             | NPU / GPU              |
|                       | model          | string                 | "Xenova/resnet-50"|                 |
| doRAGSearch           | texts          | Array<string>          | []            | GPU
|                       | query          | string                 | ""            |                      |

## Usage

Here are examples of how to use each function:

### RAG (Retrieval-Augmented Generation)

```javascript
import { doRAGSearch } from 'web-ai-toolkit';

window.showOpenFilePicker().then(async (file) => {
    const fileBlob = await file[0].getFile();
    const text = await fileBlob.text();

    // text can be derived from anything
    // this sample is just meant to be extremely simple
    // for example, your text could be an array of text that you have OCR'ed
    // from some photos

    const query = "My Search Query";
    const ragQuery = await doRAGSearch([text], query);
    console.log(ragQuery);
});
```

### Transcribe Audio File

```javascript
import { transcribeAudioFile } from 'web-ai-toolkit';

const audioFile = ...; // Your audio file Blob
const transcription = await transcribeAudioFile(audioFile, "Xenova/whisper-tiny", true, "en-US");
console.log(transcription);
```

### Text to Speech

```javascript
import { textToSpeech } from 'web-ai-toolkit';

const text = "Hello, world!";
const audio = await textToSpeech(text);
console.log(audio);
```

### Summarize Text

```javascript
import { summarize } from 'web-ai-toolkit';

const text = "Long text to be summarized...";
const summary = await summarize(text);
console.log(summary);
```

### Optical Character Recognition (OCR)

```javascript
import { ocr } from 'web-ai-toolkit';

const image = ...; // Your image Blob
const text = await ocr(image);
console.log(text);
```

### Image Classification

```javascript
import { classifyImage } from 'web-ai-toolkit';

const image = ...; // Your image Blob
const text = await classifyImage(image);
console.log(text);
```

## Technical Details

All AI processing is performed locally on the device, ensuring data privacy and reducing latency. All AI workloads are run using the WebGPU API or using the built in Chromium AI APIs in Edge and Chrome.

## Contribution

We welcome contributions to the Web AI Toolkit. Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

The Web AI Toolkit is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or support, please open an issue here on GitHub

---

Thank you for using the Web AI Toolkit! We hope it makes integrating AI into your applications easier and more efficient.
