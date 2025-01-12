import * as webllm from "@mlc-ai/web-llm";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import {
    RunnableSequence,
    RunnablePassthrough,
} from "@langchain/core/runnables";

class WebLLMEmbeddings implements EmbeddingsInterface {
    engine: webllm.MLCEngineInterface;
    modelId: string;
    constructor(engine: webllm.MLCEngineInterface, modelId: string) {
        this.engine = engine;
        this.modelId = modelId;
    }

    async _embed(texts: string[]): Promise<number[][]> {
        const reply = await this.engine.embeddings.create({
            input: texts,
            model: this.modelId,
        });
        const result: number[][] = [];
        for (let i = 0; i < texts.length; i++) {
            result.push(reply.data[i].embedding);
        }
        return result;
    }

    async embedQuery(document: string): Promise<number[]> {
        return this._embed([document]).then((embeddings) => embeddings[0]);
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        return this._embed(documents);
    }
}

const initProgressCallback = (report: webllm.InitProgressReport) => {
    console.log('Progress:', report);
};

let vectorStore: MemoryVectorStore;
let engine: webllm.MLCEngineInterface;
let llmModelId: string;

export async function loadUpDocuments(texts: string[]): Promise<MemoryVectorStore> {
    const embeddingModelId = "snowflake-arctic-embed-s-q0f32-MLC-b4";
    llmModelId = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

    if (!engine) {
        engine = await webllm.CreateMLCEngine(
            [embeddingModelId, llmModelId],
            {
                initProgressCallback: initProgressCallback,
                logLevel: "INFO", // specify the log level
            },
        );
    }

    vectorStore = await MemoryVectorStore.fromTexts(
        [...texts],
        [{ id: 1 }],
        new WebLLMEmbeddings(engine, embeddingModelId),
    );
    return vectorStore;
}

export async function simpleRAG(texts: string[], query: string): Promise<any> {
    const vectorStore = await loadUpDocuments(texts);
    const retriever = vectorStore.asRetriever();

    const prompt =
        PromptTemplate.fromTemplate(`Answer the question based only on the following context:
    {context}

    Question: {question}`);

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
        },
        prompt,
    ]);

    const formattedPrompt = (
        await chain.invoke(query)
    ).toString();
    const reply = await engine.chat.completions.create({
        messages: [{ role: "user", content: formattedPrompt }],
        model: llmModelId,
    });

    return reply || "";
}
