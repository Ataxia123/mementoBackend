"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
require("./styles/globals.css");
require("./styles/lib/markdown.css");
require("./styles/lib/highlight.css");
const locales_1 = __importDefault(require("./locales"));
const toaster_1 = require("@/app/components/ui/toaster");
const theme_provider_1 = require("@/app/components/layout/theme-provider");
exports.metadata = {
    title: locales_1.default.Welcome.Title,
    description: locales_1.default.Welcome.SubTitle,
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    appleWebApp: {
        title: locales_1.default.Welcome.Title,
        statusBarStyle: "default",
    },
};
function RootLayout({ children, }) {
    return (<html lang="en">
            <head>
                <link rel="manifest" href="/site.webmanifest"></link>
                <script src="/serviceWorkerRegister.js" defer></script>
            </head>
            <body>
                <theme_provider_1.ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                    <toaster_1.Toaster />
                </theme_provider_1.ThemeProvider>
            </body>
        </html>);
}
exports.default = RootLayout;
