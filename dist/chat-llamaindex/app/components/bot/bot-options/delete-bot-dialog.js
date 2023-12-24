"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/app/lib/utils");
const locales_1 = __importDefault(require("../../../locales"));
const alert_dialog_1 = require("../../ui/alert-dialog");
const use_bot_1 = require("../use-bot");
const button_1 = require("@/app/components/ui/button");
function DeleteBotDialogContent() {
    const { deleteBot } = (0, use_bot_1.useBot)();
    return (<alert_dialog_1.AlertDialogContent>
      <alert_dialog_1.AlertDialogHeader>
        <alert_dialog_1.AlertDialogTitle>Are you absolutely sure?</alert_dialog_1.AlertDialogTitle>
        <alert_dialog_1.AlertDialogDescription>
          {locales_1.default.Bot.Item.DeleteConfirm}
        </alert_dialog_1.AlertDialogDescription>
      </alert_dialog_1.AlertDialogHeader>
      <alert_dialog_1.AlertDialogFooter>
        <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
        <alert_dialog_1.AlertDialogAction className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "destructive" }))} onClick={deleteBot}>
          Continue
        </alert_dialog_1.AlertDialogAction>
      </alert_dialog_1.AlertDialogFooter>
    </alert_dialog_1.AlertDialogContent>);
}
exports.default = DeleteBotDialogContent;
