"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("@/app/client/fetch/file");
const url_1 = require("@/app/client/fetch/url");
const button_1 = require("@/app/components/ui/button");
const textarea_1 = require("@/app/components/ui/textarea");
const use_toast_1 = require("@/app/components/ui/use-toast");
const useSubmit_1 = require("@/app/hooks/useSubmit");
const utils_1 = require("@/app/lib/utils");
const bot_1 = require("@/app/store/bot");
const lucide_react_1 = require("lucide-react");
const react_1 = __importStar(require("react"));
const use_debounce_1 = require("use-debounce");
const controller_1 = require("../../client/controller");
const constant_1 = require("../../constant");
const locales_1 = __importDefault(require("../../locales"));
const store_1 = require("../../store");
const autogrow_1 = require("../../utils/autogrow");
const mobile_1 = require("../../utils/mobile");
const file_uploader_1 = __importDefault(require("../ui/file-uploader"));
const image_preview_1 = __importDefault(require("../ui/image-preview"));
const llm_1 = require("../../client/platforms/llm");
function ChatInput(props) {
    const { inputRef, userInput, setUserInput, setTemporaryURLInput, scrollToBottom, setAutoScroll, } = props;
    const { toast } = (0, use_toast_1.useToast)();
    const { shouldSubmit } = (0, useSubmit_1.useSubmitHandler)();
    const isMobileScreen = (0, mobile_1.useMobileScreen)();
    const botStore = (0, bot_1.useBotStore)();
    const bot = botStore.currentBot();
    const session = botStore.currentSession();
    const [imageFile, setImageFile] = (0, react_1.useState)();
    const [temporaryBlobUrl, setTemporaryBlobUrl] = (0, react_1.useState)();
    // auto grow input
    const [inputRows, setInputRows] = (0, react_1.useState)(2);
    const measure = (0, use_debounce_1.useDebouncedCallback)(() => {
        const rows = inputRef.current ? (0, autogrow_1.autoGrowTextArea)(inputRef.current) : 1;
        const inputRows = Math.min(20, Math.max(1 + Number(!isMobileScreen), rows));
        setInputRows(inputRows);
    }, 100, {
        leading: true,
        trailing: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (0, react_1.useEffect)(measure, [userInput]);
    const onInput = (text) => {
        setUserInput(text);
    };
    const showError = (errMsg) => {
        toast({
            title: errMsg,
            variant: "destructive",
        });
    };
    const callLLM = async ({ input, fileDetail, }) => {
        await (0, store_1.callSession)(bot, session, {
            onUpdateMessages: (messages) => {
                botStore.updateBotSession((session) => {
                    // trigger re-render of messages
                    session.messages = messages;
                }, bot.id);
            },
        }, input, fileDetail);
        setImageFile(undefined);
        setTemporaryURLInput("");
        setUserInput("");
    };
    const manageTemporaryBlobUrl = (file, action) => {
        let tempUrl;
        if ((0, file_1.isImageFileType)(file.type)) {
            tempUrl = URL.createObjectURL(file);
            setTemporaryBlobUrl(tempUrl);
        }
        return action().finally(() => {
            if ((0, file_1.isImageFileType)(file.type)) {
                URL.revokeObjectURL(tempUrl);
                setTemporaryBlobUrl(undefined);
            }
        });
    };
    const doSubmitFile = async (fileInput) => {
        try {
            await manageTemporaryBlobUrl(fileInput.file, async () => {
                const fileDetail = await (0, file_1.getDetailContentFromFile)(fileInput);
                if ((0, file_1.isImageFileType)(fileInput.file.type)) {
                    setImageFile(fileDetail);
                }
                else {
                    callLLM({ fileDetail });
                }
            });
        }
        catch (error) {
            showError(locales_1.default.Upload.Failed(error.message));
        }
    };
    const doSubmit = async (input) => {
        if (input.trim() === "")
            return;
        if ((0, url_1.isURL)(input)) {
            setTemporaryURLInput(input);
        }
        await callLLM({ input, fileDetail: imageFile });
        if (!isMobileScreen)
            inputRef.current?.focus();
        setAutoScroll(true);
    };
    // check if should send message
    const onInputKeyDown = (e) => {
        if (shouldSubmit(e)) {
            if (!isRunning && !isUploadingImage) {
                doSubmit(userInput);
            }
            e.preventDefault();
        }
    };
    const autoFocus = !isMobileScreen; // wont auto focus on mobile screen
    const isRunning = controller_1.ChatControllerPool.isRunning(bot.id);
    const removeImage = () => {
        setImageFile(undefined);
    };
    const previewImage = temporaryBlobUrl || imageFile?.url;
    const isUploadingImage = temporaryBlobUrl !== undefined;
    const checkExtension = (extension) => {
        if (!constant_1.ALLOWED_DOCUMENT_EXTENSIONS.includes(extension)) {
            return locales_1.default.Upload.Invalid(constant_1.ALLOWED_DOCUMENT_EXTENSIONS.join(","));
        }
        if (!(0, llm_1.isVisionModel)(bot.modelConfig.model) &&
            constant_1.ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
            return locales_1.default.Upload.ModelDoesNotSupportImages(constant_1.ALLOWED_TEXT_EXTENSIONS.join(","));
        }
        return null;
    };
    return (<div className="flex flex-1 items-end relative">
      {previewImage && (<div className="absolute top-[12px] left-[12px] w-[50px] h-[50px] rounded-xl cursor-pointer">
          <image_preview_1.default url={previewImage} uploading={isUploadingImage} onRemove={removeImage}/>
        </div>)}
      <textarea_1.Textarea className={(0, utils_1.cn)("ring-inset focus-visible:ring-offset-0 pr-28 md:pr-40 min-h-[56px]", {
            "pt-20": previewImage,
        })} ref={inputRef} placeholder={isMobileScreen ? locales_1.default.Chat.InputMobile : locales_1.default.Chat.Input} onInput={(e) => onInput(e.currentTarget.value)} value={userInput} onKeyDown={onInputKeyDown} onFocus={scrollToBottom} onClick={scrollToBottom} rows={inputRows} autoFocus={autoFocus}/>
      <div className="my-2 flex items-center gap-2.5 absolute right-[15px]">
        <file_uploader_1.default config={{
            inputId: "document-uploader",
            allowedExtensions: constant_1.ALLOWED_DOCUMENT_EXTENSIONS,
            checkExtension,
            fileSizeLimit: constant_1.DOCUMENT_FILE_SIZE_LIMIT,
            disabled: isRunning || isUploadingImage,
        }} onUpload={doSubmitFile} onError={showError}/>
        {isMobileScreen ? (<button_1.Button size="icon" onClick={() => doSubmit(userInput)} disabled={isRunning || isUploadingImage}>
            <lucide_react_1.Send className="h-4 w-4"/>
          </button_1.Button>) : (<button_1.Button onClick={() => doSubmit(userInput)} disabled={isRunning || isUploadingImage}>
            <lucide_react_1.Send className="h-4 w-4 mr-2"/>
            {locales_1.default.Chat.Send}
          </button_1.Button>)}
      </div>
    </div>);
}
exports.default = ChatInput;
