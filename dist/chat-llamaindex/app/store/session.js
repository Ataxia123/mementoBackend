"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSession = exports.createEmptySession = exports.createMessage = void 0;
const nanoid_1 = require("nanoid");
const controller_1 = require("../client/controller");
const url_1 = require("../client/fetch/url");
const llm_1 = require("../client/platforms/llm");
const format_1 = require("../utils/format");
const file_1 = require("../client/fetch/file");
function createMessage(override) {
    return {
        id: (0, nanoid_1.nanoid)(),
        date: new Date().toLocaleString(),
        role: "user",
        content: "",
        ...override,
    };
}
exports.createMessage = createMessage;
function createEmptySession() {
    return {
        messages: [],
    };
}
exports.createEmptySession = createEmptySession;
async function createTextInputMessage(content, urlDetail) {
    if ((0, url_1.isURL)(content)) {
        const urlDetail = await (0, url_1.fetchSiteContent)(content);
        return createFileInputMessage(urlDetail);
    }
    else {
        return createMessage({
            role: "user",
            content,
            urlDetail,
        });
    }
}
async function createFileInputMessage(fileDetail) {
    console.log("[User Input] did get file detail: ", fileDetail);
    delete fileDetail["content"]; // clean content in file detail as we are only going to use its embeddings
    return createMessage({
        role: "user",
        urlDetail: fileDetail,
    });
}
function transformAssistantMessageForSending(message) {
    const { content } = message;
    // messages with role URL are assistant messages that contain a URL - the content is already retrieved by context-prompt.tsx
    if (message.role !== "URL")
        return message;
    return {
        role: "assistant",
        content,
    };
}
async function createUserMessage(content, urlDetail) {
    let userMessage;
    if (content) {
        userMessage = await createTextInputMessage(content, urlDetail);
    }
    else if (urlDetail) {
        userMessage = await createFileInputMessage(urlDetail);
    }
    else {
        throw new Error("Invalid user message");
    }
    return userMessage;
}
async function callSession(bot, session, callbacks, content, fileDetail) {
    const modelConfig = bot.modelConfig;
    let userMessage;
    try {
        userMessage = await createUserMessage(content, fileDetail);
    }
    catch (error) {
        // an error occurred when creating user message, show error message as bot message and don't call API
        const userMessage = createMessage({
            role: "user",
            content,
        });
        const botMessage = createMessage({
            role: "assistant",
            content: (0, format_1.prettyObject)({
                error: true,
                message: error.message || "Invalid user message",
            }),
        });
        // updating the session will trigger a re-render, so it will display the messages
        session.messages = session.messages.concat([userMessage, botMessage]);
        callbacks.onUpdateMessages(session.messages);
        return;
    }
    const botMessage = createMessage({
        role: "assistant",
        streaming: true,
    });
    const contextPrompts = bot.context.slice();
    // get messages starting from the last clear context index (or all messages if there is no clear context index)
    const recentMessages = !session.clearContextIndex
        ? session.messages
        : session.messages.slice(session.clearContextIndex);
    let sendMessages = [
        ...contextPrompts,
        ...recentMessages.map(transformAssistantMessageForSending),
    ];
    // save user's and bot's message
    session.messages = session.messages.concat([userMessage, botMessage]);
    callbacks.onUpdateMessages(session.messages);
    let embeddings;
    let message;
    if (userMessage.urlDetail && !(0, file_1.isImageFileType)(userMessage.urlDetail.type)) {
        // if the user sends document, let the LLM summarize the content of the URL and just use the document's embeddings
        message = "Summarize the given context briefly in 200 words or less";
        embeddings = userMessage.urlDetail?.embeddings;
        sendMessages = [];
    }
    else {
        // collect embeddings of all messages
        embeddings = session.messages
            .flatMap((message) => message.urlDetail?.embeddings)
            .filter((m) => m !== undefined);
        embeddings = embeddings.length > 0 ? embeddings : undefined;
        if (userMessage.urlDetail?.type &&
            (0, file_1.isImageFileType)(userMessage.urlDetail?.type)) {
            message = [
                {
                    type: "text",
                    text: userMessage.content,
                },
                {
                    type: "image_url",
                    image_url: {
                        url: userMessage.urlDetail.url,
                    },
                },
            ];
        }
        else {
            message = userMessage.content;
        }
    }
    // make request
    const controller = new AbortController();
    controller_1.ChatControllerPool.addController(bot.id, controller);
    const api = new llm_1.LLMApi();
    await api.chat({
        datasource: bot.datasource,
        embeddings,
        message: message,
        chatHistory: sendMessages,
        config: modelConfig,
        controller,
        onUpdate(message) {
            if (message) {
                botMessage.content = message;
                callbacks.onUpdateMessages(session.messages.concat());
            }
        },
        onFinish(memoryMessage) {
            botMessage.streaming = false;
            if (memoryMessage) {
                // all optional memory message returned by the LLM
                const newChatMessages = createMessage({ ...memoryMessage });
                session.messages = session.messages.concat(newChatMessages);
            }
            callbacks.onUpdateMessages(session.messages.concat());
            controller_1.ChatControllerPool.remove(bot.id);
        },
        onError(error) {
            const isAborted = error.message.includes("aborted");
            botMessage.content +=
                "\n\n" +
                    (0, format_1.prettyObject)({
                        error: true,
                        message: error.message,
                    });
            botMessage.streaming = false;
            userMessage.isError = !isAborted;
            botMessage.isError = !isAborted;
            callbacks.onUpdateMessages(session.messages);
            controller_1.ChatControllerPool.remove(bot.id);
            console.error("[Chat] failed ", error);
        },
    });
}
exports.callSession = callSession;
