"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyBot = exports.createDemoBots = exports.DEMO_BOTS = void 0;
const nanoid_1 = require("nanoid");
const locales_1 = __importDefault(require("../locales"));
const store_1 = require("../store");
const TEMPLATE = (PERSONA) => `I want you to act as a ${PERSONA}. I will provide you with the context needed to solve my problem. Use intelligent, simple, and understandable language. Be concise. It is helpful to explain your thoughts step by step and with bullet points.`;
exports.DEMO_BOTS = [
    {
        id: "1",
        avatar: "1f916",
        name: "GPT-4 Vision Preview",
        botHello: "Hello! How can I assist you today?",
        context: [],
        modelConfig: {
            model: "gpt-4-vision-preview",
            temperature: 0.3,
            maxTokens: 4096,
            sendMemory: false,
        },
        readOnly: true,
        hideContext: false,
    },
    {
        id: "2",
        avatar: "1f916",
        name: "My Documents",
        botHello: "Hello! How can I assist you today?",
        context: [],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.5,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        hideContext: false,
    },
    {
        id: "3",
        avatar: "1f5a5-fe0f",
        name: "Red Hat Linux Expert",
        botHello: "Hello! How can I help you with Red Hat Linux?",
        context: [
            {
                role: "system",
                content: TEMPLATE("Red Hat Linux Expert"),
            },
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "redhat",
        hideContext: false,
    },
    {
        id: "4",
        avatar: "1f454",
        name: "Apple Watch Genius",
        botHello: "Hello! How can I help you with Apple Watches?",
        context: [
            {
                role: "system",
                content: TEMPLATE("Apple Genius specialized in Apple Watches"),
            },
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "watchos",
        hideContext: false,
    },
    {
        id: "5",
        avatar: "1f4da",
        name: "German Basic Law Expert",
        botHello: "Hello! How can I assist you today?",
        context: [
            {
                role: "system",
                content: TEMPLATE("Lawyer specialized in the basic law of Germany"),
            },
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "basic_law_germany",
        hideContext: false,
    },
];
const createDemoBots = () => {
    const map = {};
    exports.DEMO_BOTS.forEach((demoBot) => {
        const bot = JSON.parse(JSON.stringify(demoBot));
        bot.session = (0, store_1.createEmptySession)();
        map[bot.id] = bot;
    });
    return map;
};
exports.createDemoBots = createDemoBots;
const createEmptyBot = () => ({
    id: (0, nanoid_1.nanoid)(),
    avatar: "1f916",
    name: locales_1.default.Store.DefaultBotName,
    context: [],
    modelConfig: {
        model: "gpt-4-1106-preview",
        temperature: 0.5,
        maxTokens: 4096,
        sendMemory: true,
    },
    readOnly: false,
    createdAt: Date.now(),
    botHello: locales_1.default.Store.BotHello,
    hideContext: false,
    session: (0, store_1.createEmptySession)(),
});
exports.createEmptyBot = createEmptyBot;
