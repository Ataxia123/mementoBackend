"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatAction = void 0;
const button_1 = require("@/app/components/ui/button");
const tooltip_1 = require("@/app/components/ui/tooltip");
function ChatAction(props) {
    const { text, icon, onClick, showTitle, buttonVariant } = props;
    const buttonVariantDefault = "ghost";
    const variant = buttonVariant || buttonVariantDefault;
    if (!showTitle) {
        return (<tooltip_1.TooltipProvider delayDuration={200}>
        <tooltip_1.Tooltip>
          <tooltip_1.TooltipTrigger asChild>
            <div className="px-1">
              <button_1.Button size="icon" variant={variant} className="group" onClick={onClick}>
                {icon}
              </button_1.Button>
            </div>
          </tooltip_1.TooltipTrigger>
          <tooltip_1.TooltipContent side="top" className="text-xs text-muted-foreground">
            {text}
          </tooltip_1.TooltipContent>
        </tooltip_1.Tooltip>
      </tooltip_1.TooltipProvider>);
    }
    return (<button_1.Button size="sm" variant={variant} className="group" onClick={onClick}>
      {icon}
      <div className="text-xs text-muted-foreground ml-2">{text}</div>
    </button_1.Button>);
}
exports.ChatAction = ChatAction;
