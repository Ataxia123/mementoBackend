"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const hover_card_1 = require("@/app/components/ui/hover-card");
const loading_1 = require("@/app/components/ui/loading");
const scroll_area_1 = require("@/app/components/ui/scroll-area");
const use_toast_1 = require("@/app/components/ui/use-toast");
const useScroll_1 = require("@/app/hooks/useScroll");
const utils_1 = require("@/app/lib/utils");
const bot_1 = require("@/app/store/bot");
const clipboard_1 = require("@/app/utils/clipboard");
const lucide_react_1 = require("lucide-react");
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = require("react");
const controller_1 = require("../../client/controller");
const constant_1 = require("../../constant");
const locales_1 = __importDefault(require("../../locales"));
const store_1 = require("../../store");
const format_1 = require("../../utils/format");
const mobile_1 = require("../../utils/mobile");
const separator_1 = require("../ui/separator");
const chat_action_1 = require("./chat-action");
const chat_header_1 = __importDefault(require("./chat-header"));
const chat_input_1 = __importDefault(require("./chat-input"));
const clear_context_divider_1 = require("./clear-context-divider");
const file_1 = require("@/app/client/fetch/file");
const Markdown = (0, dynamic_1.default)(async () => (await import("../ui/markdown")).Markdown, {
    loading: () => <loading_1.Loading />,
});
function Chat() {
    const { toast } = (0, use_toast_1.useToast)();
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    const botStore = (0, bot_1.useBotStore)();
    const bot = botStore.currentBot();
    const session = botStore.currentSession();
    const inputRef = (0, react_1.useRef)(null);
    const [userInput, setUserInput] = (0, react_1.useState)("");
    const [temporaryURLInput, setTemporaryURLInput] = (0, react_1.useState)("");
    const { scrollRef, setAutoScroll, scrollDomToBottom } = (0, useScroll_1.useScrollToBottom)();
    (0, react_1.useEffect)(() => {
        botStore.updateBotSession((session) => {
            const stopTiming = Date.now() - constant_1.REQUEST_TIMEOUT_MS;
            session.messages.forEach((m) => {
                // check if should stop all stale messages
                if (m.isError || (m.date && new Date(m.date).getTime() < stopTiming)) {
                    if (m.streaming) {
                        m.streaming = false;
                    }
                    if (m.content.length === 0) {
                        m.isError = true;
                        m.content = (0, format_1.prettyObject)({
                            error: true,
                            message: "empty response",
                        });
                    }
                }
            });
        }, bot.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const deleteMessage = (msgId) => {
        botStore.updateBotSession((session) => (session.messages = session.messages.filter((m) => m.id !== msgId)), bot.id);
    };
    const onDelete = (msgId) => {
        deleteMessage(msgId);
    };
    const context = (0, react_1.useMemo)(() => {
        return bot.hideContext ? [] : bot.context.slice();
    }, [bot.context, bot.hideContext]);
    const getUrlTypePrefix = (type) => {
        if (type === "text/html")
            return "HTML";
        if (type === "application/pdf")
            return "PDF";
        if (type === "text/plain")
            return "TXT";
        return locales_1.default.Upload.UnknownFileType;
    };
    // preview messages
    const renderMessages = (0, react_1.useMemo)(() => {
        const getFrontendMessages = (messages) => {
            return messages.map((message) => {
                if (!message.urlDetail || (0, file_1.isImageFileType)(message.urlDetail.type))
                    return message;
                const urlTypePrefix = getUrlTypePrefix(message.urlDetail.type);
                const sizeInKB = Math.round(message.urlDetail.size / 1024);
                return {
                    ...message,
                    content: `${message.urlDetail.url}\n\`${urlTypePrefix} • ${sizeInKB} KB\``,
                };
            });
        };
        const getUrlPreviewMessage = () => {
            const lastMessage = session.messages[session.messages.length - 1];
            const showPreviewUrl = temporaryURLInput && !lastMessage?.streaming;
            let previewUrlMessage;
            if (showPreviewUrl) {
                previewUrlMessage = (0, store_1.createMessage)({
                    role: "user",
                    content: `${temporaryURLInput}\n\`${locales_1.default.Chat.LoadingURL}\``,
                });
            }
            return previewUrlMessage;
        };
        return context
            .concat(bot.botHello
            ? [
                (0, store_1.createMessage)({
                    role: "assistant",
                    content: bot.botHello,
                }),
            ]
            : [])
            .concat(getFrontendMessages(session.messages))
            .concat(getUrlPreviewMessage() || []);
    }, [session.messages, bot.botHello, temporaryURLInput, context]);
    const [msgRenderIndex, _setMsgRenderIndex] = (0, react_1.useState)(Math.max(0, renderMessages.length - constant_1.CHAT_PAGE_SIZE));
    function setMsgRenderIndex(newIndex) {
        newIndex = Math.min(renderMessages.length - constant_1.CHAT_PAGE_SIZE, newIndex);
        newIndex = Math.max(0, newIndex);
        _setMsgRenderIndex(newIndex);
    }
    const messages = (0, react_1.useMemo)(() => {
        const endRenderIndex = Math.min(msgRenderIndex + 3 * constant_1.CHAT_PAGE_SIZE, renderMessages.length);
        return renderMessages.slice(msgRenderIndex, endRenderIndex);
    }, [msgRenderIndex, renderMessages]);
    const onChatBodyScroll = (e) => {
        const bottomHeight = e.scrollTop + e.clientHeight;
        const edgeThreshold = e.clientHeight;
        const isTouchTopEdge = e.scrollTop <= edgeThreshold;
        const isTouchBottomEdge = bottomHeight >= e.scrollHeight - edgeThreshold;
        const isHitBottom = bottomHeight >= e.scrollHeight - 10;
        const prevPageMsgIndex = msgRenderIndex - constant_1.CHAT_PAGE_SIZE;
        const nextPageMsgIndex = msgRenderIndex + constant_1.CHAT_PAGE_SIZE;
        if (isTouchTopEdge && !isTouchBottomEdge) {
            setMsgRenderIndex(prevPageMsgIndex);
        }
        else if (isTouchBottomEdge) {
            setMsgRenderIndex(nextPageMsgIndex);
        }
        setAutoScroll(isHitBottom);
    };
    function scrollToBottom() {
        setMsgRenderIndex(renderMessages.length - constant_1.CHAT_PAGE_SIZE);
        scrollDomToBottom();
    }
    // clear context index = context length + index in messages
    const clearContextIndex = (session.clearContextIndex ?? -1) >= 0
        ? session.clearContextIndex +
            context.length +
            (bot.botHello ? 1 : 0) -
            msgRenderIndex
        : -1;
    const clearContext = () => {
        botStore.updateBotSession((session) => {
            if (session.clearContextIndex === session.messages.length) {
                session.clearContextIndex = undefined;
            }
            else {
                session.clearContextIndex = session.messages.length;
            }
        }, bot.id);
    };
    const stop = () => controller_1.ChatControllerPool.stop(bot.id);
    const isRunning = controller_1.ChatControllerPool.isRunning(bot.id);
    return (<div className="flex flex-col relative h-full" key={bot.id}>
      <chat_header_1.default />
      <scroll_area_1.ScrollArea className="flex-1 overflow-auto overflow-x-hidden relative overscroll-none pb-10 p-5" ref={scrollRef} onScroll={(e) => onChatBodyScroll(e.currentTarget)} onMouseDown={() => inputRef.current?.blur()} onTouchStart={() => {
            inputRef.current?.blur();
            setAutoScroll(false);
        }}>
        <div className="space-y-5">
          {messages.map((message, i) => {
            const isUser = message.role === "user";
            const isMemory = message.role === "memory";
            const isContext = i < context.length;
            const showActions = i > 0 && !(message.content.length === 0) && !isContext;
            const showThinking = message.streaming;
            const shouldShowClearContextDivider = i === clearContextIndex - 1;
            return (<div className="space-y-5" key={i}>
                <div className={isUser
                    ? "flex flex-row-reverse"
                    : "flex flex-row last:animate-[slide-in_ease_0.3s]"}>
                  <hover_card_1.HoverCard openDelay={200}>
                    <hover_card_1.HoverCardTrigger asChild>
                      <div className={(0, utils_1.cn)("max-w-[80%] flex flex-col items-start", isUser && "items-end")}>
                        {showThinking && (<div className={"text-xs text-[#aaa] leading-normal my-1"}>
                            {locales_1.default.Chat.Thinking}
                          </div>)}
                        <div className={(0, utils_1.cn)("box-border max-w-full text-sm select-text relative break-words rounded-lg px-3 py-2", isUser
                    ? "ml-auto bg-primary text-primary-foreground"
                    : isMemory
                        ? "italic text-secondary-foreground"
                        : "bg-muted")}>
                          {message.urlDetail?.type &&
                    (0, file_1.isImageFileType)(message.urlDetail.type) && (<img src={message.urlDetail.url} alt="Message image" className="object-contain w-full h-52 rounded-lg mb-2"/>)}
                          <Markdown content={message.content} loading={message.streaming &&
                    message.content.length === 0 &&
                    !isUser} onDoubleClickCapture={() => {
                    if (!isMobileScreen)
                        return;
                    setUserInput(message.content);
                }} parentRef={scrollRef} defaultShow={i >= messages.length - 6}/>
                        </div>

                        <div className="text-xs text-muted-foreground opacity-80 whitespace-nowrap text-right w-full box-border pointer-events-none z-[1]">
                          {isContext
                    ? locales_1.default.Chat.IsContext
                    : message.date?.toLocaleString()}
                        </div>
                      </div>
                    </hover_card_1.HoverCardTrigger>
                    {showActions && (<hover_card_1.HoverCardContent side="top" align={isUser ? "end" : "start"} className="py-1 px-0 w-fit">
                        <div className="flex items-center divide-x">
                          {!message.streaming && (<>
                              {message.id && (<chat_action_1.ChatAction text={locales_1.default.Chat.Actions.Delete} icon={<lucide_react_1.Trash className="w-4 h-4"/>} onClick={() => onDelete(message.id)}/>)}
                              <chat_action_1.ChatAction text={locales_1.default.Chat.Actions.Copy} icon={<lucide_react_1.Clipboard className="w-4 h-4"/>} onClick={() => (0, clipboard_1.copyToClipboard)(message.content, toast)}/>
                            </>)}
                        </div>
                      </hover_card_1.HoverCardContent>)}
                  </hover_card_1.HoverCard>
                </div>
                {shouldShowClearContextDivider && (<clear_context_divider_1.ClearContextDivider botId={bot.id}/>)}
              </div>);
        })}
        </div>
      </scroll_area_1.ScrollArea>
      <separator_1.Separator />
      <div className="relative w-full box-border flex-col pt-2.5 p-5 space-y-2">
        <div className="flex justify-between items-center">
          <chat_action_1.ChatAction text={locales_1.default.Chat.InputActions.Clear} icon={<lucide_react_1.Eraser className="w-4 h-4"/>} onClick={clearContext} showTitle buttonVariant="outline"/>
          {isRunning && (<chat_action_1.ChatAction onClick={stop} text={locales_1.default.Chat.InputActions.Stop} icon={<lucide_react_1.PauseCircle className="w-4 h-4"/>} showTitle buttonVariant="outline"/>)}
        </div>

        <chat_input_1.default inputRef={inputRef} userInput={userInput} temporaryURLInput={temporaryURLInput} setUserInput={setUserInput} setTemporaryURLInput={setTemporaryURLInput} scrollToBottom={scrollToBottom} setAutoScroll={setAutoScroll}/>
      </div>
    </div>);
}
exports.Chat = Chat;
