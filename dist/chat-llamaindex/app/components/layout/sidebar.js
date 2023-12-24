"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideBar = void 0;
const theme_toggle_1 = require("@/app/components/layout/theme-toggle");
const lucide_react_1 = require("lucide-react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_router_dom_1 = require("react-router-dom");
const constant_1 = require("../../constant");
const locales_1 = __importDefault(require("../../locales"));
const button_1 = require("../ui/button");
const typography_1 = __importDefault(require("../ui/typography"));
const home_1 = require("@/app/components/home");
const BotList = (0, dynamic_1.default)(async () => (await import("../bot/bot-list")).default, {
    loading: () => null,
});
function SideBar(props) {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { setShowSidebar } = (0, home_1.useSidebarContext)();
    return (<div className="h-full relative group border-r w-full md:w-[300px]">
      <div className="w-full h-full p-5 flex flex-col gap-5">
        <div className="flex flex-col flex-1">
          <div className="mb-5 flex justify-between gap-5 items-start">
            <div>
              <typography_1.default.H1>{locales_1.default.Welcome.Title}</typography_1.default.H1>
              <div className="text-sm text-muted-foreground">
                {locales_1.default.Welcome.SubTitle}
              </div>
            </div>
            <theme_toggle_1.ThemeToggle />
          </div>
          <BotList />
        </div>

        <div className="flex items-center justify-between">
          <button_1.Button variant="secondary" size="icon" onClick={() => {
            navigate(constant_1.Path.Settings);
            setShowSidebar(false);
        }}>
            <lucide_react_1.Settings className="h-4 w-4"/>
          </button_1.Button>

          <button_1.Button variant="outline" size="sm" onClick={() => window.open(constant_1.GITHUB_URL, "_blank")}>
            <lucide_react_1.Github className="mr-2 h-4 w-4"/>
            <span>{locales_1.default.Home.Github}</span>
          </button_1.Button>
        </div>
      </div>
    </div>);
}
exports.SideBar = SideBar;
