"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearContextDivider = void 0;
const bot_1 = require("@/app/store/bot");
const locales_1 = __importDefault(require("../../locales"));
const card_1 = require("@/app/components/ui/card");
function ClearContextDivider({ botId }) {
    const botStore = (0, bot_1.useBotStore)();
    return (<card_1.Card className="cursor-pointer hover:border-primary rounded-sm" onClick={() => botStore.updateBotSession((session) => (session.clearContextIndex = undefined), botId)}>
      <card_1.CardContent className="p-1 group text-foreground hover:text-primary">
        <div className="text-center text-xs font-semibold">
          <span className="inline-block group-hover:hidden opacity-50">
            {locales_1.default.Context.Clear}
          </span>
          <span className="hidden group-hover:inline-block">
            {locales_1.default.Context.Revert}
          </span>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.ClearContextDivider = ClearContextDivider;
