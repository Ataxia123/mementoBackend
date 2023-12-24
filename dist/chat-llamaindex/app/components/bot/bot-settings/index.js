"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_prompt_1 = require("@/app/components/bot/bot-settings/context-prompt");
const use_bot_1 = require("@/app/components/bot/use-bot");
const bot_config_1 = __importDefault(require("./bot-config"));
const model_config_1 = require("./model-config");
const separator_1 = require("@/app/components/ui/separator");
function BotSettings(props) {
    const { bot, updateBot } = (0, use_bot_1.useBot)();
    const updateConfig = (updater) => {
        if (bot.readOnly)
            return;
        const config = { ...bot.modelConfig };
        updater(config);
        updateBot((bot) => {
            bot.modelConfig = config;
        });
    };
    return (<div className="space-y-5 pb-5">
      <context_prompt_1.ContextPrompts context={bot.context} updateContext={(updater) => {
            const context = bot.context.slice();
            updater(context);
            updateBot((bot) => (bot.context = context));
        }}/>
      <separator_1.Separator />
      <bot_config_1.default />
      <model_config_1.ModelConfigList modelConfig={{ ...bot.modelConfig }} updateConfig={updateConfig}/>
    </div>);
}
exports.default = BotSettings;
