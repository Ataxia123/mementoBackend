"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMApi = exports.isVisionModel = exports.ALL_MODELS = exports.MESSAGE_ROLES = void 0;
const constant_1 = require("@/app/constant");
const fetch_event_source_1 = require("@fortaine/fetch-event-source");
exports.MESSAGE_ROLES = [
    "system",
    "user",
    "assistant",
    "URL",
    "memory",
];
exports.ALL_MODELS = [
    "gpt-4",
    "gpt-4-1106-preview",
    "gpt-4-vision-preview",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
];
const CHAT_PATH = "/api/llm";
function isVisionModel(model) {
    return model === "gpt-4-vision-preview";
}
exports.isVisionModel = isVisionModel;
class LLMApi {
    async chat(options) {
        const requestPayload = {
            message: options.message,
            chatHistory: options.chatHistory.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            config: options.config,
            datasource: options.datasource,
            embeddings: options.embeddings,
        };
        console.log("[Request] payload: ", requestPayload);
        const requestTimeoutId = setTimeout(() => options.controller?.abort(), constant_1.REQUEST_TIMEOUT_MS);
        options.controller.signal.onabort = () => options.onFinish();
        const handleError = (e) => {
            clearTimeout(requestTimeoutId);
            console.log("[Request] failed to make a chat request", e);
            options.onError?.(e);
        };
        try {
            const chatPayload = {
                method: "POST",
                body: JSON.stringify(requestPayload),
                signal: options.controller?.signal,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let llmResponse = "";
            await (0, fetch_event_source_1.fetchEventSource)(CHAT_PATH, {
                ...chatPayload,
                async onopen(res) {
                    clearTimeout(requestTimeoutId);
                    if (!res.ok) {
                        const json = await res.json();
                        handleError(new Error(json.message));
                    }
                },
                onmessage(msg) {
                    try {
                        const json = JSON.parse(msg.data);
                        if (json.done) {
                            options.onFinish(json.memoryMessage);
                        }
                        else if (json.error) {
                            options.onError?.(new Error(json.error));
                        }
                        else {
                            // received a new token
                            llmResponse += json;
                            options.onUpdate(llmResponse);
                        }
                    }
                    catch (e) {
                        console.error("[Request] error parsing streaming delta", msg);
                    }
                },
                onclose() {
                    options.onFinish();
                },
                onerror: handleError,
                openWhenHidden: true,
            });
        }
        catch (e) {
            handleError(e);
        }
    }
}
exports.LLMApi = LLMApi;
