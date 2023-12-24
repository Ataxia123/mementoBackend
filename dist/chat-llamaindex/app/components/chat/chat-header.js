"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("@/app/components/ui/button");
const bot_1 = require("@/app/store/bot");
const lucide_react_1 = require("lucide-react");
const locales_1 = __importDefault(require("../../locales"));
const mobile_1 = require("../../utils/mobile");
const home_1 = require("../home");
const separator_1 = require("../ui/separator");
const typography_1 = __importDefault(require("../ui/typography"));
function ChatHeader() {
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    const { setShowSidebar } = (0, home_1.useSidebarContext)();
    const botStore = (0, bot_1.useBotStore)();
    const bot = botStore.currentBot();
    const session = botStore.currentSession();
    const numberOfMessages = (bot.botHello?.length ? 1 : 0) + session.messages.length;
    return (<div className="relative">
      <div className="absolute top-4 left-5">
        {isMobileScreen && (<button_1.Button size="icon" variant="outline" title={locales_1.default.Chat.Actions.ChatList} onClick={() => setShowSidebar(true)}>
            <lucide_react_1.Undo2 />
          </button_1.Button>)}
      </div>
      <div className="text-center py-4">
        <typography_1.default.H4>{bot.name}</typography_1.default.H4>
        <div className="text-sm text-muted-foreground">
          {locales_1.default.Chat.SubTitle(numberOfMessages)}
        </div>
      </div>
      <separator_1.Separator />
    </div>);
}
exports.default = ChatHeader;
