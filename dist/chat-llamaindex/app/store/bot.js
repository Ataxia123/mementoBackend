"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBotStore = void 0;
const nanoid_1 = require("nanoid");
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const session_1 = require("./session");
const bot_data_1 = require("@/app/bots/bot.data");
const demoBots = (0, bot_data_1.createDemoBots)();
exports.useBotStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    bots: demoBots,
    currentBotId: Object.values(demoBots)[0].id,
    currentBot() {
        return get().bots[get().currentBotId];
    },
    selectBot(id) {
        set(() => ({ currentBotId: id }));
    },
    currentSession() {
        return get().currentBot().session;
    },
    updateBotSession(updater, botId) {
        const bots = get().bots;
        updater(bots[botId].session);
        set(() => ({ bots }));
    },
    get(id) {
        return get().bots[id] || undefined;
    },
    getAll() {
        const list = Object.values(get().bots).map((b) => ({
            ...b,
            createdAt: b.createdAt || 0,
        }));
        return list.sort((a, b) => b.createdAt - a.createdAt);
    },
    getByShareId(shareId) {
        return get()
            .getAll()
            .find((b) => shareId === b.share?.id);
    },
    create(bot, options) {
        const bots = get().bots;
        const id = (0, nanoid_1.nanoid)();
        const session = (0, session_1.createEmptySession)();
        bots[id] = {
            ...(0, bot_data_1.createEmptyBot)(),
            ...bot,
            id,
            session,
            readOnly: options?.readOnly || false,
        };
        if (options?.reset) {
            bots[id].share = undefined;
        }
        set(() => ({ bots }));
        return bots[id];
    },
    update(id, updater) {
        const bots = get().bots;
        const bot = bots[id];
        if (!bot)
            return;
        const updateBot = { ...bot };
        updater(updateBot);
        bots[id] = updateBot;
        set(() => ({ bots }));
    },
    delete(id) {
        const bots = JSON.parse(JSON.stringify(get().bots));
        delete bots[id];
        let nextId = get().currentBotId;
        if (nextId === id) {
            nextId = Object.keys(bots)[0];
        }
        set(() => ({ bots, currentBotId: nextId }));
    },
    backup() {
        return get();
    },
    restore(state) {
        if (!state.bots) {
            throw new Error("no state object");
        }
        set(() => ({ bots: state.bots }));
    },
    clearAllData() {
        localStorage.clear();
        location.reload();
    },
}), {
    name: "bot-store",
    version: 1,
    migrate: (persistedState, version) => {
        const state = persistedState;
        if (version < 1) {
            bot_data_1.DEMO_BOTS.forEach((demoBot) => {
                // check if there is a bot with the same name as the demo bot
                const bot = Object.values(state.bots).find((b) => b.name === demoBot.name);
                if (bot) {
                    // if so, update the id of the bot to the demo bot id
                    delete state.bots[bot.id];
                    bot.id = demoBot.id;
                    state.bots[bot.id] = bot;
                }
                else {
                    // if not, store the new demo bot
                    const bot = JSON.parse(JSON.stringify(demoBot));
                    bot.session = (0, session_1.createEmptySession)();
                    state.bots[bot.id] = bot;
                }
            });
            state.currentBotId = Object.values(state.bots)[0].id;
        }
        return state;
    },
}));
