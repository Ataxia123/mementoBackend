"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxDuration = exports.dynamic = exports.runtime = exports.POST = void 0;
const llamaindex_1 = require("llamaindex");
const server_1 = require("next/server");
const datasource_1 = require("./datasource");
const constants_mjs_1 = require("@/scripts/constants.mjs");
const locales_1 = __importDefault(require("@/app/locales"));
async function createChatEngine(serviceContext, datasource, embeddings) {
    let contextGenerator;
    if (datasource || embeddings) {
        let index;
        if (embeddings) {
            // TODO: merge indexes, currently we prefer own embeddings
            index = await createIndex(serviceContext, embeddings);
        }
        else if (datasource) {
            index = await (0, datasource_1.getDataSource)(serviceContext, datasource);
        }
        const retriever = index.asRetriever();
        retriever.similarityTopK = 5;
        contextGenerator = new llamaindex_1.DefaultContextGenerator({ retriever });
    }
    return new llamaindex_1.HistoryChatEngine({
        llm: serviceContext.llm,
        contextGenerator,
    });
}
async function createIndex(serviceContext, embeddings) {
    const embeddingResults = embeddings.map((config) => {
        return new llamaindex_1.TextNode({ text: config.text, embedding: config.embedding });
    });
    const indexDict = new llamaindex_1.IndexDict();
    for (const node of embeddingResults) {
        indexDict.addNode(node);
    }
    const index = await llamaindex_1.VectorStoreIndex.init({
        indexStruct: indexDict,
        serviceContext: serviceContext,
    });
    index.vectorStore.add(embeddingResults);
    if (!index.vectorStore.storesText) {
        await index.docStore.addDocuments(embeddingResults, true);
    }
    await index.indexStore?.addIndexStruct(indexDict);
    index.indexStruct = indexDict;
    return index;
}
function createReadableStream(stream, chatHistory) {
    let responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    let aborted = false;
    writer.closed.catch(() => {
        // reader aborted the stream
        aborted = true;
    });
    const encoder = new TextEncoder();
    const onNext = async () => {
        try {
            const { value, done } = await stream.next();
            if (aborted)
                return;
            if (!done) {
                writer.write(encoder.encode(`data: ${JSON.stringify(value)}\n\n`));
                onNext();
            }
            else {
                writer.write(`data: ${JSON.stringify({
                    done: true,
                    // get the optional message containing the chat summary
                    memoryMessage: chatHistory
                        .newMessages()
                        .filter((m) => m.role === "memory")
                        .at(0),
                })}\n\n`);
                writer.close();
            }
        }
        catch (error) {
            console.error("[LlamaIndex]", error);
            writer.write(`data: ${JSON.stringify({
                error: locales_1.default.Chat.LLMError,
            })}\n\n`);
            writer.close();
        }
    };
    onNext();
    return responseStream.readable;
}
async function POST(request) {
    try {
        const body = await request.json();
        const { message, chatHistory: messages, datasource, config, embeddings, } = body;
        if (!message || !messages || !config) {
            return server_1.NextResponse.json({
                error: "message, chatHistory and config are required in the request body",
            }, { status: 400 });
        }
        const llm = new llamaindex_1.OpenAI({
            model: config.model,
            temperature: config.temperature,
            topP: config.topP,
            maxTokens: config.maxTokens,
        });
        const serviceContext = (0, llamaindex_1.serviceContextFromDefaults)({
            llm,
            chunkSize: constants_mjs_1.DATASOURCES_CHUNK_SIZE,
            chunkOverlap: constants_mjs_1.DATASOURCES_CHUNK_OVERLAP,
        });
        const chatEngine = await createChatEngine(serviceContext, datasource, embeddings);
        const chatHistory = config.sendMemory
            ? new llamaindex_1.SummaryChatHistory({ llm, messages })
            : new llamaindex_1.SimpleChatHistory({ messages });
        const stream = await chatEngine.chat(message, chatHistory, true);
        const readableStream = createReadableStream(stream, chatHistory);
        return new server_1.NextResponse(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "Cache-Control": "no-cache, no-transform",
            },
        });
    }
    catch (error) {
        console.error("[LlamaIndex]", error);
        return server_1.NextResponse.json({
            error: locales_1.default.Chat.LLMError,
        }, {
            status: 500,
        });
    }
}
exports.POST = POST;
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
// Set max running time of function, for Vercel Hobby use 10 seconds, see https://vercel.com/docs/functions/serverless-functions/runtimes#maxduration
exports.maxDuration = 120;
