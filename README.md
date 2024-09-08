
# Web AI Toolkit

The Web AI Toolkit simplifies the integration of AI features, such as OCR, speech-to-text, text summarization and more into your application. It ensures data privacy and offline capability by running all AI workloads locally, leveraging WebNN when available, with a fallback to WebGPU.

## Installation

To install the Web AI Toolkit, run:

```sh
npm install web-ai-toolkit
```

## Available Functions

| Function Name         | Parameter      | Type                   | Default Value | Supported Hardware |
|-----------------------|----------------|------------------------|---------------|--------------------|
| transcribeAudioFile   | audioFile      | Blob                   | -             | NPU                |
|                       | model          | string                 | "Xenova/whisper-tiny"|                    |
|                       | timestamps     | boolean                | false         |                    |
|                       | language       | string                 | "en-US"       |                    |
| textToSpeech          | text           | string                 | -             | GPU                |
|                       | model          | string                 | "Xenova/mms-tts-eng"|                    |
| summarize             | text           | string                 | -             | GPU                |
|                       | model          | string                 | "Xenova/distilbart-cnn-6-6"|                |
| ocr                   | image          | Blob                   | -             | GPU                |
|                       | model          | string                 | "Xenova/trocr-small-printed"|                 |

## Technical Details

The Web AI Toolkit utilizes the [transformers.js project](https://huggingface.co/docs/transformers.js/index) to run AI workloads. All AI processing is performed locally on the device, ensuring data privacy and reducing latency. AI workloads are run using the [WebNN API](https://learn.microsoft.com/en-us/windows/ai/directml/webnn-overview) when available, otherwise falling back to the WebGPU API. Both of these APIs are used to "hardware accelerate" the AI inferences, with WebNN targeting NPUs and GPUs, and WebGPU strictly targeting GPUs.

## Usage

Here are examples of how to use each function:

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

## Contribution

We welcome contributions to the Web AI Toolkit. Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

The Web AI Toolkit is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or support, please open an issue here on GitHub

---

Thank you for using the Web AI Toolkit! We hope it makes integrating AI into your applications easier and more efficient.
