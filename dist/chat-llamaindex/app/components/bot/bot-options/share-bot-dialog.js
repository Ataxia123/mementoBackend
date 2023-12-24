"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/app/components/ui/card");
const input_1 = require("@/app/components/ui/input");
const loading_1 = require("@/app/components/ui/loading");
const use_toast_1 = require("@/app/components/ui/use-toast");
const clipboard_1 = require("@/app/utils/clipboard");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const react_query_1 = require("react-query");
const locales_1 = __importDefault(require("../../../locales"));
const button_1 = require("../../ui/button");
const dialog_1 = require("../../ui/dialog");
const use_bot_1 = require("../use-bot");
async function share(bot) {
    const res = await fetch("/api/share", {
        method: "POST",
        body: JSON.stringify({ bot: bot }),
    });
    const json = await res.json();
    console.log("[Share]", json);
    if (!res.ok) {
        throw new Error(json.msg);
    }
    return json;
}
function ShareBotDialogContent() {
    const { toast } = (0, use_toast_1.useToast)();
    const { bot, updateBot } = (0, use_bot_1.useBot)();
    const shareMutation = (0, react_query_1.useMutation)(share, {
        onSuccess: (data) => {
            updateBot((bot) => {
                bot.share = { ...bot.share, id: data.key };
            });
        },
    });
    // FIXME: check dependency warning
    (0, react_1.useEffect)(() => {
        shareMutation.mutate(bot);
    }, []);
    return (<dialog_1.DialogContent className="max-w-3xl">
      <dialog_1.DialogHeader>
        <dialog_1.DialogTitle>{locales_1.default.Share.Title}</dialog_1.DialogTitle>
      </dialog_1.DialogHeader>
      <div>
        {!shareMutation.error && (<card_1.Card>
            <card_1.CardContent className="divide-y pt-6">
              <div className="flex items-center px-3 py-0 gap-4 text-sm">
                <div className="font-medium">{locales_1.default.Share.Url.Title}</div>
                {shareMutation.data ? (<div className="flex flex-1 gap-4">
                    <input_1.Input className="flex-1 w-full" type="text" value={shareMutation.data.url} readOnly/>
                    <button_1.Button variant="outline" size="icon" onClick={() => (0, clipboard_1.copyToClipboard)(shareMutation.data.url, toast)}>
                      <lucide_react_1.Copy className="w-4 h-4"/>
                    </button_1.Button>
                  </div>) : (<div className="flex flex-1 justify-end items-center text-muted-foreground gap-1">
                    <loading_1.Loading />
                    Loading...
                  </div>)}
              </div>
            </card_1.CardContent>
          </card_1.Card>)}
      </div>
      <dialog_1.DialogFooter>
        <div>
          {shareMutation.error ? (<span className="text-destructive">{locales_1.default.Share.Url.Error}</span>) : (<div>{locales_1.default.Share.Url.Hint}</div>)}
        </div>
      </dialog_1.DialogFooter>
    </dialog_1.DialogContent>);
}
exports.default = ShareBotDialogContent;
