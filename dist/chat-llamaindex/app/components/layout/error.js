"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const react_1 = __importDefault(require("react"));
const constant_1 = require("../../constant");
const locales_1 = __importDefault(require("../../locales"));
const download_1 = require("../../utils/download");
const alert_dialog_1 = require("@/app/components/ui/alert-dialog");
const utils_1 = require("@/app/lib/utils");
const button_1 = require("@/app/components/ui/button");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/app/components/ui/card");
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, info: null };
    }
    componentDidCatch(error, info) {
        // Update state with error details
        this.setState({ hasError: true, error, info });
    }
    clearAndSaveData() {
        try {
            (0, download_1.downloadAs)(JSON.stringify(localStorage), "chat-llamaindex-snapshot.json");
        }
        finally {
            localStorage.clear();
            location.reload();
        }
    }
    render() {
        if (this.state.hasError) {
            // Render error message
            return (<div className="flex items-center justify-center w-screen h-screen">
          <card_1.Card className="bg-background text-sm rounded-md w-4/5 mx-auto">
            <card_1.CardHeader>
              <card_1.CardTitle>Oops, something went wrong!</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-5">
              <pre className="overflow-auto text-xs h-[500px]">
                <code>{this.state.error?.toString()}</code>
                <code>{this.state.info?.componentStack}</code>
              </pre>
              <div className="flex justify-between">
                <button_1.Button variant="outline" size="sm" onClick={() => window.open(constant_1.GITHUB_URL, "_blank")}>
                  <lucide_react_1.Github className="mr-2 h-4 w-4"/>
                  <span>Report This Error</span>
                </button_1.Button>
                <alert_dialog_1.AlertDialog>
                  <alert_dialog_1.AlertDialogTrigger asChild>
                    <button_1.Button variant="outline">
                      <lucide_react_1.RefreshCcw className="mr-2 h-4 w-4"/>
                      <span>Clear All Data</span>
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
                    this.clearAndSaveData();
                }}>
                        Continue
                      </alert_dialog_1.AlertDialogAction>
                    </alert_dialog_1.AlertDialogFooter>
                  </alert_dialog_1.AlertDialogContent>
                </alert_dialog_1.AlertDialog>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>);
        }
        // if no error occurred, render children
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
