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
const use_bot_1 = require("@/app/components/bot/use-bot");
const emoji_picker_react_1 = __importStar(require("emoji-picker-react"));
const react_1 = require("react");
const locales_1 = __importDefault(require("../../../locales"));
const card_1 = require("../../ui/card");
const checkbox_1 = require("../../ui/checkbox");
const input_1 = require("../../ui/input");
const popover_1 = require("../../ui/popover");
const config_item_1 = __importDefault(require("./config-item"));
const emoji_1 = require("@/app/components/ui/emoji");
function BotConfig() {
    const { bot, updateBot } = (0, use_bot_1.useBot)();
    const [showPicker, setShowPicker] = (0, react_1.useState)(false);
    return (<>
      <div className="font-semibold mb-2">{locales_1.default.Bot.Config.Title}</div>
      <card_1.Card>
        <card_1.CardContent className="divide-y p-5">
          <config_item_1.default title={locales_1.default.Bot.Config.Avatar}>
            <popover_1.Popover open={showPicker}>
              <popover_1.PopoverTrigger onClick={() => setShowPicker(true)}>
                <emoji_1.BotAvatar avatar={bot.avatar}/>
              </popover_1.PopoverTrigger>
              <popover_1.PopoverContent align="end" className="w-fit">
                <emoji_picker_react_1.default lazyLoadEmojis theme={emoji_picker_react_1.Theme.AUTO} getEmojiUrl={emoji_1.getEmojiUrl} onEmojiClick={(e) => {
            updateBot((bot) => (bot.avatar = e.unified));
            setShowPicker(false);
        }}/>
              </popover_1.PopoverContent>
            </popover_1.Popover>
          </config_item_1.default>
          <config_item_1.default title={locales_1.default.Bot.Config.Name}>
            <input_1.Input type="text" value={bot.name} onInput={(e) => updateBot((bot) => {
            bot.name = e.currentTarget.value;
        })}/>
          </config_item_1.default>
          <config_item_1.default title={locales_1.default.Bot.Config.HideContext.Title} subTitle={locales_1.default.Bot.Config.HideContext.SubTitle}>
            <checkbox_1.Checkbox checked={bot.hideContext} onCheckedChange={(checked) => {
            updateBot((bot) => {
                bot.hideContext = Boolean(checked);
            });
        }}/>
          </config_item_1.default>
          <config_item_1.default title={locales_1.default.Bot.Config.BotHello.Title} subTitle={locales_1.default.Bot.Config.BotHello.SubTitle}>
            <input_1.Input type="text" value={bot.botHello || ""} onChange={(e) => {
            updateBot((bot) => {
                bot.botHello = e.currentTarget.value;
            });
        }}/>
          </config_item_1.default>
        </card_1.CardContent>
      </card_1.Card>
    </>);
}
exports.default = BotConfig;
