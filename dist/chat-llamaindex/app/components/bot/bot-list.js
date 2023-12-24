"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const edit_bot_dialog_1 = __importDefault(require("@/app/components/bot/bot-options/edit-bot-dialog"));
const use_bot_1 = require("@/app/components/bot/use-bot");
const dialog_1 = require("@/app/components/ui/dialog");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const constant_1 = require("../../constant");
const locales_1 = __importDefault(require("../../locales"));
const bot_1 = require("../../store/bot");
const button_1 = require("../ui/button");
const input_1 = require("../ui/input");
const scroll_area_1 = require("../ui/scroll-area");
const bot_item_1 = __importDefault(require("./bot-item"));
function BotList() {
    const botStore = (0, bot_1.useBotStore)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [searchText, setSearchText] = (0, react_1.useState)("");
    const [editBotId, setEditBotId] = (0, react_1.useState)(undefined);
    const onClickContainer = (e) => {
        if (e.target === e.currentTarget) {
            navigate(constant_1.Path.Home);
        }
    };
    const onClickCreate = () => {
        const newBot = botStore.create();
        botStore.selectBot(newBot.id);
        setEditBotId(newBot.id);
    };
    const allBots = botStore.getAll();
    const filteredBots = allBots.filter((b) => b.name.toLowerCase().includes(searchText.toLowerCase()));
    const botList = searchText.length > 0 ? filteredBots : allBots;
    const editBot = editBotId ? botStore.get(editBotId) : undefined;
    return (<div className="flex-1" onClick={onClickContainer}>
      <div className="space-y-2 mb-4">
        <dialog_1.Dialog>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button className="w-full" onClick={onClickCreate}>
              <lucide_react_1.PlusCircle className="mr-2 h-4 w-4"/> {locales_1.default.Bot.Page.Create}
            </button_1.Button>
          </dialog_1.DialogTrigger>
          {editBot && (<use_bot_1.BotItemContextProvider bot={editBot}>
              <edit_bot_dialog_1.default />
            </use_bot_1.BotItemContextProvider>)}
        </dialog_1.Dialog>
        <input_1.Input className="text-center" type="text" placeholder={locales_1.default.Bot.Page.Search(allBots.length)} onInput={(e) => setSearchText(e.currentTarget.value)}/>
      </div>
      <scroll_area_1.ScrollArea className="h-[60vh] pr-0 md:pr-3">
        {botList.map((b) => (<bot_item_1.default key={b.id} bot={b}/>))}
      </scroll_area_1.ScrollArea>
    </div>);
}
exports.default = BotList;
