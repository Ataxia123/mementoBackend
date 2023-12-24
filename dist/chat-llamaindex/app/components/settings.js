"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const config_item_1 = __importDefault(require("@/app/components/bot/bot-settings/config-item"));
const home_1 = require("@/app/components/home");
const alert_dialog_1 = require("@/app/components/ui/alert-dialog");
const button_1 = require("@/app/components/ui/button");
const card_1 = require("@/app/components/ui/card");
const scroll_area_1 = require("@/app/components/ui/scroll-area");
const separator_1 = require("@/app/components/ui/separator");
const typography_1 = __importDefault(require("@/app/components/ui/typography"));
const use_toast_1 = require("@/app/components/ui/use-toast");
const utils_1 = require("@/app/lib/utils");
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const constant_1 = require("../constant");
const locales_1 = __importDefault(require("../locales"));
const bot_1 = require("../store/bot");
const download_1 = require("../utils/download");
const mobile_1 = require("../utils/mobile");
const error_1 = require("./layout/error");
function SettingHeader() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setShowSidebar } = (0, home_1.useSidebarContext)();
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    return (<div className="relative flex justify-between items-center px-5 py-3.5">
      <div>
        <typography_1.default.H4>{locales_1.default.Settings.Title}</typography_1.default.H4>
        <div className="text-sm text-muted-foreground">
          {locales_1.default.Settings.SubTitle}
        </div>
      </div>
      <button_1.Button variant="outline" size="icon" onClick={() => {
            navigate(constant_1.Path.Home);
            if (isMobileScreen)
                setShowSidebar(true);
        }}>
        <lucide_react_1.X className="w-4 h-4"/>
      </button_1.Button>
    </div>);
}
function DangerItems() {
    const botStore = (0, bot_1.useBotStore)();
    return (<card_1.Card>
      <card_1.CardContent className="divide-y p-5">
        <config_item_1.default title={locales_1.default.Settings.Danger.Clear.Title} subTitle={locales_1.default.Settings.Danger.Clear.SubTitle}>
          <alert_dialog_1.AlertDialog>
            <alert_dialog_1.AlertDialogTrigger asChild>
              <button_1.Button variant="destructive">
                {locales_1.default.Settings.Danger.Clear.Action}
              </button_1.Button>
            </alert_dialog_1.AlertDialogTrigger>
            <alert_dialog_1.AlertDialogContent>
              <alert_dialog_1.AlertDialogHeader>
                <alert_dialog_1.AlertDialogTitle>
                  {locales_1.default.Settings.Danger.Clear.Confirm}
                </alert_dialog_1.AlertDialogTitle>
              </alert_dialog_1.AlertDialogHeader>
              <alert_dialog_1.AlertDialogFooter>
                <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                <alert_dialog_1.AlertDialogAction className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "destructive" }))} onClick={() => {
            botStore.clearAllData();
        }}>
                  Continue
                </alert_dialog_1.AlertDialogAction>
              </alert_dialog_1.AlertDialogFooter>
            </alert_dialog_1.AlertDialogContent>
          </alert_dialog_1.AlertDialog>
        </config_item_1.default>
      </card_1.CardContent>
    </card_1.Card>);
}
function BackupItems() {
    const botStore = (0, bot_1.useBotStore)();
    const { toast } = (0, use_toast_1.useToast)();
    const backupBots = () => {
        (0, download_1.downloadAs)(JSON.stringify(botStore.backup()), constant_1.FileName.Bots);
    };
    const restoreBots = async () => {
        try {
            const content = await (0, download_1.readFromFile)();
            const importBots = JSON.parse(content);
            botStore.restore(importBots);
            toast({
                title: locales_1.default.Settings.Backup.Upload.Success,
                variant: "success",
            });
        }
        catch (err) {
            console.error("[Restore] ", err);
            toast({
                title: locales_1.default.Settings.Backup.Upload.Failed(err.message),
                variant: "destructive",
            });
        }
    };
    return (<card_1.Card className="mb-5">
      <card_1.CardContent className="divide-y p-5">
        <config_item_1.default title={locales_1.default.Settings.Backup.Download.Title} subTitle={locales_1.default.Settings.Backup.Download.SutTitle}>
          <button_1.Button variant="outline" size="icon" onClick={backupBots}>
            <lucide_react_1.HardDriveDownload className="w-5 h-5"/>
          </button_1.Button>
        </config_item_1.default>
        <config_item_1.default title={locales_1.default.Settings.Backup.Upload.Title} subTitle={locales_1.default.Settings.Backup.Upload.SutTitle}>
          <button_1.Button variant="outline" size="icon" onClick={restoreBots}>
            <lucide_react_1.ArchiveRestore className="w-5 h-5"/>
          </button_1.Button>
        </config_item_1.default>
      </card_1.CardContent>
    </card_1.Card>);
}
function Settings() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setShowSidebar } = (0, home_1.useSidebarContext)();
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    (0, react_1.useEffect)(() => {
        const keydownEvent = (e) => {
            if (e.key === "Escape") {
                navigate(constant_1.Path.Home);
                if (isMobileScreen)
                    setShowSidebar(true);
            }
        };
        document.addEventListener("keydown", keydownEvent);
        return () => {
            document.removeEventListener("keydown", keydownEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<error_1.ErrorBoundary>
      <SettingHeader />
      <separator_1.Separator />
      <scroll_area_1.ScrollArea className="p-5 h-[80vh]">
        <BackupItems />
        <DangerItems />
      </scroll_area_1.ScrollArea>
    </error_1.ErrorBoundary>);
}
exports.Settings = Settings;
