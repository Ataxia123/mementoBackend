"use client";
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = exports.useSidebarContext = void 0;
const react_1 = __importStar(require("react"));
const react_query_1 = require("react-query");
const mobile_1 = require("../utils/mobile");
const dynamic_1 = __importDefault(require("next/dynamic"));
const constant_1 = require("../constant");
const error_1 = require("./layout/error");
const react_router_dom_1 = require("react-router-dom");
const bot_1 = require("../store/bot");
const sidebar_1 = require("./layout/sidebar");
const loading_1 = require("@/app/components/ui/loading");
const SettingsPage = (0, dynamic_1.default)(async () => (await import("./settings")).Settings, {
    loading: () => <loading_1.LoadingPage />,
});
const ChatPage = (0, dynamic_1.default)(async () => (await import("./chat/chat")).Chat, {
    loading: () => <loading_1.LoadingPage />,
});
const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setHasHydrated(true);
    }, []);
    return hasHydrated;
};
const loadAsyncGoogleFont = () => {
    const linkEl = document.createElement("link");
    const googleFontUrl = "https://fonts.googleapis.com";
    linkEl.rel = "stylesheet";
    linkEl.href =
        googleFontUrl + "/css2?family=Noto+Sans:wght@300;400;700;900&display=swap";
    document.head.appendChild(linkEl);
};
// if a bot is passed this HOC ensures that the bot is added to the store
// and that the user can directly have a chat session with it
function withBot(Component, bot) {
    return function WithBotComponent() {
        const [botInitialized, setBotInitialized] = (0, react_1.useState)(false);
        const navigate = (0, react_router_dom_1.useNavigate)();
        const botStore = (0, bot_1.useBotStore)();
        if (bot && !botInitialized) {
            if (!bot.share?.id) {
                throw new Error("bot must have a shared id");
            }
            // ensure that bot for the same share id is not created a 2nd time
            let sharedBot = botStore.getByShareId(bot.share?.id);
            if (!sharedBot) {
                sharedBot = botStore.create(bot, { readOnly: true });
            }
            // let the user directly chat with the bot
            botStore.selectBot(sharedBot.id);
            setTimeout(() => {
                // redirect to chat - use history API to clear URL
                history.pushState({}, "", "/");
                navigate(constant_1.Path.Chat);
            }, 1);
            setBotInitialized(true);
            return <loading_1.LoadingPage />;
        }
        return <Component />;
    };
}
const SidebarContext = react_1.default.createContext(null);
function SidebarContextProvider(props) {
    const [showSidebar, setShowSidebar] = (0, react_1.useState)(true);
    return (<SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
      {props.children}
    </SidebarContext.Provider>);
}
const useSidebarContext = () => {
    const context = (0, react_1.useContext)(SidebarContext);
    if (!context) {
        throw new Error("useSidebarContext must be used within an SidebarContextProvider");
    }
    return context;
};
exports.useSidebarContext = useSidebarContext;
function Screen() {
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    const { showSidebar } = (0, exports.useSidebarContext)();
    const showSidebarOnMobile = showSidebar || !isMobileScreen;
    (0, react_1.useEffect)(() => {
        loadAsyncGoogleFont();
    }, []);
    return (<main className="flex overflow-hidden h-screen w-screen box-border">
      <>
        {showSidebarOnMobile && <sidebar_1.SideBar />}
        <div className="flex-1 overflow-hidden">
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path={constant_1.Path.Chat} element={<ChatPage />}/>
            <react_router_dom_1.Route path={constant_1.Path.Settings} element={<SettingsPage />}/>
          </react_router_dom_1.Routes>
        </div>
      </>
    </main>);
}
function Home({ bot }) {
    if (!useHasHydrated()) {
        return <loading_1.LoadingPage />;
    }
    const BotScreen = withBot(Screen, bot);
    const queryClient = new react_query_1.QueryClient();
    return (<error_1.ErrorBoundary>
      <react_router_dom_1.HashRouter>
        <react_query_1.QueryClientProvider client={queryClient}>
          <SidebarContextProvider>
            <BotScreen />
          </SidebarContextProvider>
        </react_query_1.QueryClientProvider>
      </react_router_dom_1.HashRouter>
    </error_1.ErrorBoundary>);
}
exports.Home = Home;
