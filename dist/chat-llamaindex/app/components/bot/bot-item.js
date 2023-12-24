"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/app/lib/utils");
const bot_options_1 = __importDefault(require("./bot-options"));
const use_bot_1 = require("./use-bot");
const emoji_1 = require("@/app/components/ui/emoji");
function BotItemUI() {
    const { bot, isActive, ensureSession } = (0, use_bot_1.useBot)();
    return (<div className={(0, utils_1.cn)("flex items-center cursor-pointer mb-2 last:mb-0 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground relative", isActive && "border-primary")}>
      <div className="flex items-center space-x-2 w-full p-4 pr-12" onClick={ensureSession}>
        <div className="w-[18px] h-[18px]">
          <emoji_1.BotAvatar avatar={bot.avatar}/>
        </div>
        <div className="font-medium">{bot.name}</div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <bot_options_1.default />
      </div>
    </div>);
}
function BotItem(props) {
    return (<use_bot_1.BotItemContextProvider bot={props.bot}>
      <BotItemUI />
    </use_bot_1.BotItemContextProvider>);
}
exports.default = BotItem;
