"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const locales_1 = __importDefault(require("../../../locales"));
const dialog_1 = require("../../ui/dialog");
const scroll_area_1 = require("../../ui/scroll-area");
const separator_1 = require("../../ui/separator");
const bot_settings_1 = __importDefault(require("../bot-settings"));
function EditBotDialogContent() {
    return (<dialog_1.DialogContent className="max-w-4xl">
      <dialog_1.DialogHeader>
        <dialog_1.DialogTitle>{locales_1.default.Bot.EditModal.Title}</dialog_1.DialogTitle>
      </dialog_1.DialogHeader>
      <separator_1.Separator />
      <scroll_area_1.ScrollArea className="h-[50vh] mt-4 pr-4">
        <bot_settings_1.default />
      </scroll_area_1.ScrollArea>
    </dialog_1.DialogContent>);
}
exports.default = EditBotDialogContent;
