"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingPage = exports.Loading = void 0;
const lucide_react_1 = require("lucide-react");
function Loading() {
    return <lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>;
}
exports.Loading = Loading;
function LoadingPage() {
    return (<div className="w-full h-screen max-h-full flex items-center justify-center text-sm text-muted-foreground">
      <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
      Loading...
    </div>);
}
exports.LoadingPage = LoadingPage;
