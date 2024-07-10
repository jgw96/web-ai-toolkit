
# Web AI Toolkit

The Web AI Toolkit simplifies the integration of AI features, such as OCR and audio file transcription, into your application. It ensures optimal performance by running all AI workloads locally, leveraging WebGPU and WASM technologies.

## Installation

To install the Web AI Toolkit, run:

```sh
npm install web-ai-toolkit
```

## Available Functions

| Function Name         | Parameter      | Type                   | Default Value |
|-----------------------|----------------|------------------------|---------------|
| transcribeAudioFile   | audioFile      | Blob                   | -             |
|                       | model          | string                 | "Xenova/whisper-tiny"|
|                       | timestamps     | boolean                | false         |
|                       | language       | string                 | "en-US"       |
| textToSpeech          | text           | string                 | -             |
|                       | model          | string                 | "Xenova/mms-tts-eng"|
| summarize             | text           | string                 | -             |
|                       | model          | string                 | "Xenova/distilbart-cnn-6-6"|
| ocr                   | image          | Blob                   | -             |
|                       | model          | string                 | "Xenova/trocr-small-printed|

## Technical Details

The Web AI Toolkit utilizes the [transformers.js project](https://huggingface.co/docs/transformers.js/index) to run AI workloads. All AI processing is performed locally on the device, ensuring data privacy and reducing latency.

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
