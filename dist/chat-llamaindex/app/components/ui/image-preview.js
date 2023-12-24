"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/app/lib/utils");
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const tooltip_1 = require("./tooltip");
function ImagePreview({ url, uploading, onRemove, }) {
    return (<div className="relative w-full h-full group">
      <image_1.default src={url} alt="Uploaded image" fill className="object-cover w-full h-full rounded-xl hover:brightness-75"/>
      <div className={(0, utils_1.cn)("absolute -top-2 -right-2 w-6 h-6 z-10 bg-gray-500 text-white rounded-full", { "hidden group-hover:block": !uploading })}>
        <tooltip_1.TooltipProvider>
          <tooltip_1.Tooltip delayDuration={0}>
            <tooltip_1.TooltipTrigger>
              {uploading ? (<lucide_react_1.Loader2Icon className="w-6 h-6 bg-gray-500 text-white rounded-full animate-spin p-1"/>) : (<lucide_react_1.XCircleIcon className="w-6 h-6 bg-gray-500 text-white rounded-full" onClick={onRemove}/>)}
            </tooltip_1.TooltipTrigger>
            <tooltip_1.TooltipContent side="right">
              {uploading ? "Uploading file..." : "Remove file"}
            </tooltip_1.TooltipContent>
          </tooltip_1.Tooltip>
        </tooltip_1.TooltipProvider>
      </div>
    </div>);
}
exports.default = ImagePreview;
