"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBot = exports.BotItemContextProvider = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const constant_1 = require("../../constant");
const bot_1 = require("../../store/bot");
const home_1 = require("../home");
const BotItemContext = (0, react_1.createContext)({});
const BotItemContextProvider = (props) => {
    const bot = props.bot;
    const botStore = (0, bot_1.useBotStore)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setShowSidebar } = (0, home_1.useSidebarContext)();
    const cloneBot = () => {
        const newBot = botStore.create(bot, {
            reset: true,
        });
        newBot.name = `My ${bot.name}`;
    };
    const isReadOnly = bot.readOnly;
    const isShareble = !!bot.share;
    const ensureSession = () => {
        navigate(constant_1.Path.Home);
        botStore.selectBot(bot.id);
        setShowSidebar(false);
    };
    const deleteBot = () => {
        botStore.delete(bot.id);
    };
    const updateBot = (updater) => {
        botStore.update(bot.id, updater);
    };
    const isActive = botStore.currentBotId === props.bot.id;
    return (<BotItemContext.Provider value={{
            bot,
            isActive,
            isReadOnly,
            isShareble,
            ensureSession,
            cloneBot,
            deleteBot,
            updateBot,
        }}>
      {props.children}
    </BotItemContext.Provider>);
};
exports.BotItemContextProvider = BotItemContextProvider;
const useBot = () => (0, react_1.useContext)(BotItemContext);
exports.useBot = useBot;
