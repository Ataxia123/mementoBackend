"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const locales_1 = __importDefault(require("../../../locales"));
const alert_dialog_1 = require("../../ui/alert-dialog");
const button_1 = require("../../ui/button");
const dialog_1 = require("../../ui/dialog");
const dropdown_menu_1 = require("../../ui/dropdown-menu");
const use_bot_1 = require("../use-bot");
const delete_bot_dialog_1 = __importDefault(require("./delete-bot-dialog"));
const edit_bot_dialog_1 = __importDefault(require("./edit-bot-dialog"));
const share_bot_dialog_1 = __importDefault(require("./share-bot-dialog"));
function BotOptions() {
    const { isReadOnly, isShareble, cloneBot } = (0, use_bot_1.useBot)();
    const [dialogContent, setDialogContent] = (0, react_1.useState)(null);
    return (<dialog_1.Dialog>
      <alert_dialog_1.AlertDialog>
        <dropdown_menu_1.DropdownMenu>
          <dropdown_menu_1.DropdownMenuTrigger asChild>
            <button_1.Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
            </button_1.Button>
          </dropdown_menu_1.DropdownMenuTrigger>
          <dropdown_menu_1.DropdownMenuContent>
            <dropdown_menu_1.DropdownMenuLabel>Options</dropdown_menu_1.DropdownMenuLabel>
            <dropdown_menu_1.DropdownMenuSeparator />
            <dropdown_menu_1.DropdownMenuItem onClick={cloneBot}>
              <lucide_react_1.Copy className="mr-2 w-4 h-4"/>
              <span>{locales_1.default.Bot.EditModal.Clone}</span>
            </dropdown_menu_1.DropdownMenuItem>
            <dialog_1.DialogTrigger asChild>
              <dropdown_menu_1.DropdownMenuItem disabled={isReadOnly} onClick={() => setDialogContent(<edit_bot_dialog_1.default />)}>
                <lucide_react_1.ClipboardEdit className="mr-2 w-4 h-4"/>
                <span>{locales_1.default.Bot.Item.Edit}</span>
              </dropdown_menu_1.DropdownMenuItem>
            </dialog_1.DialogTrigger>
            <alert_dialog_1.AlertDialogTrigger className="w-full">
              <dropdown_menu_1.DropdownMenuItem disabled={isReadOnly && !isShareble} onClick={() => setDialogContent(<delete_bot_dialog_1.default />)}>
                <lucide_react_1.XCircle className="mr-2 w-4 h-4"/>
                <span>{locales_1.default.Bot.Item.Delete}</span>
              </dropdown_menu_1.DropdownMenuItem>
            </alert_dialog_1.AlertDialogTrigger>
            <dialog_1.DialogTrigger asChild>
              <dropdown_menu_1.DropdownMenuItem disabled={isReadOnly} onClick={() => setDialogContent(<share_bot_dialog_1.default />)}>
                <lucide_react_1.Share2 className="mr-2 w-4 h-4"/>
                <span>{locales_1.default.Bot.Item.Share}</span>
              </dropdown_menu_1.DropdownMenuItem>
            </dialog_1.DialogTrigger>
          </dropdown_menu_1.DropdownMenuContent>
        </dropdown_menu_1.DropdownMenu>
        {dialogContent}
      </alert_dialog_1.AlertDialog>
    </dialog_1.Dialog>);
}
exports.default = BotOptions;
