
# Web AI Toolkit

The Web AI Toolkit is a powerful, privacy-first JavaScript library that brings advanced AI capabilities directly to your web applications. Run OCR, speech-to-text, text summarization, image classification, and more — all locally in the browser with no data sent to external servers.

## ✨ Key Features

- **🔒 Privacy-First**: All AI processing happens locally on the user's device
- **⚡ High Performance**: Leverages WebGPU, WebNN, and built-in browser AI APIs
- **🚀 Easy Integration**: Simple, modern JavaScript API
- **📱 Cross-Platform**: Works on any device that supports modern web standards
- **🔧 Flexible**: Supports multiple AI models and customizable parameters

## 🚀 Getting Started

### Installation

```bash
npm install web-ai-toolkit
```

### Quick Example

Here's how to get started with text summarization in just a few lines:

```javascript
import { summarize } from 'web-ai-toolkit';

const text = "Your long text content here...";
const summary = await summarize(text);
console.log(summary);
```

That's it! The library handles model loading, WebGPU initialization, and all the complex AI processing automatically.

## 🎯 How It Works

The Web AI Toolkit leverages cutting-edge web technologies to run AI models directly in your browser:

### Architecture Overview

1. **Smart Backend Detection**: The library automatically detects and uses the best available AI backend:
   - **Built-in Browser APIs**: Uses native Chromium AI APIs (like the Summarizer API) when available
   - **WebGPU**: High-performance GPU acceleration for AI workloads
   - **WebNN**: Hardware-optimized neural network processing
   - **WebAssembly**: CPU fallback for maximum compatibility

2. **Local Processing**: All AI computations happen on the user's device:
   - No data leaves the browser
   - No API keys or external services required
   - Works offline once models are loaded
   - Reduced latency compared to cloud-based solutions

3. **Automatic Model Management**: 
   - Models are downloaded and cached automatically
   - Uses browser cache for subsequent loads
   - Supports multiple model formats (ONNX, etc.)
   - Optimized for different hardware capabilities

## 📚 API Reference

### `summarize(text, options?)`

Summarizes long text content using local AI models.

**Parameters:**
- `text` (string): The text content to summarize
- `options` (object, optional): Configuration options
  - `model` (string): Model to use (default: "Xenova/distilbart-cnn-6-6")
  - `maxChunkLength` (number): Maximum chunk size for processing (default: 1000)
  - `overlap` (number): Overlap between chunks (default: 100)
  - `minChunkLength` (number): Minimum chunk size (default: 200)
  - `onProgress` (function): Progress callback `(progress: number, message: string) => void`

**Returns:** `Promise<string>` - The summarized text

**Example:**
```javascript
const summary = await summarize("Long text...", {
  maxChunkLength: 1500,
  onProgress: (progress, message) => console.log(`${progress * 100}%: ${message}`)
});
```

---

### `transcribeAudioFile(audioFile, model?, timestamps?, language?)`

Converts audio files to text using speech recognition.

**Parameters:**
- `audioFile` (Blob): The audio file to transcribe
- `model` (string, optional): Model to use (default: "Xenova/whisper-tiny")
- `timestamps` (boolean, optional): Include timestamps in output (default: false)
- `language` (string, optional): Language code (default: "en-US")

**Returns:** `Promise<string | object>` - Transcribed text or object with timestamps

**Example:**
```javascript
const transcription = await transcribeAudioFile(audioBlob, "Xenova/whisper-tiny", true, "en-US");
```

---

### `textToSpeech(text)`

Converts text to speech audio.

**Parameters:**
- `text` (string): The text to convert to speech

**Returns:** `Promise<object>` - Audio data object with `audio` (Float32Array) and `sampling_rate` properties

**Example:**
```javascript
const audioData = await textToSpeech("Hello, world!");
// Play the audio using Web Audio API
const audioContext = new AudioContext();
const audioBuffer = audioContext.createBuffer(1, audioData.audio.length, audioData.sampling_rate);
audioBuffer.getChannelData(0).set(audioData.audio);
```

---

### `ocr(image, model?)`

Extracts text from images using Optical Character Recognition.

**Parameters:**
- `image` (Blob): The image file to process
- `model` (string, optional): OCR model to use (default: "Xenova/trocr-small-printed")

**Returns:** `Promise<string>` - Extracted text from the image

**Example:**
```javascript
const extractedText = await ocr(imageBlob, "Xenova/trocr-small-printed");
```

---

### `classifyImage(image, model?)`

Classifies images and returns predictions.

**Parameters:**
- `image` (Blob): The image file to classify
- `model` (string, optional): Classification model to use (default: "Xenova/resnet-50")

**Returns:** `Promise<string>` - Classification results

**Example:**
```javascript
const classification = await classifyImage(imageBlob, "Xenova/resnet-50");
```

---

### `doRAGSearch(texts, query)`

Performs Retrieval-Augmented Generation search across text documents.

**Parameters:**
- `texts` (Array<string>): Array of text documents to search
- `query` (string): Search query

**Returns:** `Promise<string>` - Relevant information based on the query

**Example:**
```javascript
const documents = ["Document 1 content...", "Document 2 content..."];
const result = await doRAGSearch(documents, "What is the main topic?");
```

## 💡 Examples

### Text Summarization

```javascript
import { summarize } from 'web-ai-toolkit';

// Basic summarization
const text = "Long article or document content...";
const summary = await summarize(text);
console.log(summary);

// With progress tracking
const summaryWithProgress = await summarize(text, {
  onProgress: (progress, message) => {
    console.log(`${Math.round(progress * 100)}%: ${message}`);
  }
});
```

### Audio Transcription

```javascript
import { transcribeAudioFile } from 'web-ai-toolkit';

// Basic transcription
const audioFile = ...; // Your audio file Blob
const transcription = await transcribeAudioFile(audioFile);
console.log(transcription);

// With timestamps and specific language
const detailedTranscription = await transcribeAudioFile(
  audioFile, 
  "Xenova/whisper-tiny", 
  true, 
  "en-US"
);
```

### Text-to-Speech

```javascript
import { textToSpeech } from 'web-ai-toolkit';

const text = "Hello, world!";
const audioData = await textToSpeech(text);

// Play the generated audio
const audioContext = new AudioContext();
const audioBuffer = audioContext.createBuffer(
  1, 
  audioData.audio.length, 
  audioData.sampling_rate
);
audioBuffer.getChannelData(0).set(audioData.audio);

const source = audioContext.createBufferSource();
source.buffer = audioBuffer;
source.connect(audioContext.destination);
source.start(0);
```

### Optical Character Recognition (OCR)

```javascript
import { ocr } from 'web-ai-toolkit';

// From file input
const fileInput = document.querySelector('#image-input');
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const extractedText = await ocr(file);
  console.log('Extracted text:', extractedText);
});

// From image URL
const response = await fetch('path/to/image.jpg');
const imageBlob = await response.blob();
const text = await ocr(imageBlob);
```

### Image Classification

```javascript
import { classifyImage } from 'web-ai-toolkit';

const imageFile = ...; // Your image file Blob
const classification = await classifyImage(imageFile);
console.log('Classification result:', classification);

// Using a different model
const result = await classifyImage(imageFile, "Xenova/resnet-50");
```

### RAG (Retrieval-Augmented Generation)

```javascript
import { doRAGSearch } from 'web-ai-toolkit';

// Simple document search
const documents = [
  "The Web AI Toolkit is a JavaScript library for browser-based AI.",
  "It supports OCR, speech recognition, and text summarization.",
  "All processing happens locally for privacy and performance."
];

const query = "What does the Web AI Toolkit do?";
const answer = await doRAGSearch(documents, query);
console.log(answer);

// With file picker for documents
window.showOpenFilePicker().then(async (files) => {
  const fileContents = await Promise.all(
    files.map(async (fileHandle) => {
      const file = await fileHandle.getFile();
      return await file.text();
    })
  );
  
  const result = await doRAGSearch(fileContents, "Your search query");
  console.log(result);
});
```

## ⚙️ Technical Details

### Hardware Requirements

The Web AI Toolkit works on any modern web browser, with performance optimizations for different hardware:

- **WebGPU Support**: Required for optimal performance. Supported in Chrome 113+, Edge 113+, and Firefox 123+
- **Memory**: Minimum 4GB RAM recommended, 8GB+ for larger models
- **Storage**: Models are cached locally (typically 50MB-500MB per model)

### Browser Compatibility

- **Chrome/Edge 113+**: Full support including built-in AI APIs
- **Firefox 123+**: WebGPU support for all functions
- **Safari**: WebGPU support in Safari 18+ (limited)

### Privacy & Security

- **No Data Transmission**: All AI processing happens locally
- **No API Keys**: No external services or authentication required
- **Offline Capable**: Works without internet after initial model download
- **Cache Control**: Models are cached using standard browser cache APIs

All AI processing is performed locally on the device, ensuring data privacy and reducing latency. The library automatically selects the best available backend: built-in browser AI APIs, WebGPU, WebNN, or WebAssembly fallback.

## 🤝 Contributing

We welcome contributions to the Web AI Toolkit! Here's how you can help:

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/web-ai-toolkit.git
   cd web-ai-toolkit
   npm install
   ```

2. **Build and Test**
   ```bash
   npm run build    # Build the library
   npm run test     # Run tests
   npm run lint     # Check code style
   ```

3. **Local Development**
   ```bash
   npm run start    # Start development server
   ```

## 📄 License

The Web AI Toolkit is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/jgw96/web-ai-toolkit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jgw96/web-ai-toolkit/discussions)
- **Homepage**: [Project Website](https://jgw96.github.io/web-ai-toolkit/)

---

**Thank you for using the Web AI Toolkit!** 🎉

We hope this library makes integrating AI into your web applications easier, more private, and more performant. Star the repo if you find it useful, and don't hesitate to contribute or share feedback!
