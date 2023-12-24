"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPrompts = void 0;
const button_1 = require("@/app/components/ui/button");
const select_1 = require("@/app/components/ui/select");
const textarea_1 = require("@/app/components/ui/textarea");
const lucide_react_1 = require("lucide-react");
const react_query_1 = require("react-query");
const llm_1 = require("../../../client/platforms/llm");
const locales_1 = __importDefault(require("../../../locales"));
const url_1 = require("../../../client/fetch/url");
const promptInputStatusStyle = {
    loading: "text-yellow-500",
    success: "text-primary",
    error: "text-destructive",
};
function ContextPromptInputStatus(props) {
    return (<div className={promptInputStatusStyle[props.status]}>{props.detail}</div>);
}
function ContextPromptItem(props) {
    const requiredUrlInput = props.prompt.role === "URL";
    const currentInputValue = props.prompt.urlDetail
        ? props.prompt.urlDetail.url
        : props.prompt.content;
    const invalidUrlInput = !!currentInputValue && requiredUrlInput && !(0, url_1.isURL)(currentInputValue);
    const isFetchContentSuccess = requiredUrlInput && !!props.prompt.urlDetail;
    const { isLoading, error } = (0, react_query_1.useQuery)(["content", currentInputValue], () => (0, url_1.fetchSiteContent)(currentInputValue), {
        enabled: requiredUrlInput && (0, url_1.isURL)(currentInputValue),
        refetchOnWindowFocus: false,
        retry: false,
        onSuccess: (urlDetail) => {
            props.update({
                ...props.prompt,
                content: urlDetail.content,
                urlDetail,
            });
        },
    });
    const handleUpdatePrompt = async (input) => {
        props.update({
            ...props.prompt,
            content: input,
            urlDetail: undefined,
        });
    };
    const getPromptInputStatus = () => {
        if (invalidUrlInput) {
            return {
                status: "error",
                detail: "Please enter a valid URL",
            };
        }
        const errorMsg = error?.message;
        if (errorMsg) {
            return {
                status: "error",
                detail: errorMsg,
            };
        }
        if (isLoading) {
            return {
                status: "loading",
                detail: "Fetching site content...",
            };
        }
        if (isFetchContentSuccess) {
            return {
                status: "success",
                detail: "The URL has been successfully retrieved.",
            };
        }
        return undefined;
    };
    const promptInputStatus = getPromptInputStatus();
    return (<>
      {promptInputStatus && <ContextPromptInputStatus {...promptInputStatus}/>}
      <div className="flex justify-center gap-2 w-full group items-start py-2">
        <div className="flex gap-2 items-center">
          <select_1.Select value={props.prompt.role} onValueChange={(value) => props.update({
            ...props.prompt,
            role: value,
        })}>
            <select_1.SelectTrigger className="w-[120px]">
              <select_1.SelectValue placeholder="Select role"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {llm_1.MESSAGE_ROLES.map((r) => (<select_1.SelectItem key={r} value={r}>
                  {r}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        <textarea_1.Textarea value={currentInputValue} className={"flex-1 max-w-full text-left min-h-0 ring-inset focus-visible:ring-offset-0"} rows={4} onBlur={() => {
            // If the selection is not removed when the user loses focus, some
            // extensions like "Translate" will always display a floating bar
            window?.getSelection()?.removeAllRanges();
        }} onInput={(e) => handleUpdatePrompt(e.currentTarget.value)}/>
        <div className="flex flex-col space-y-2">
          <button_1.Button variant="destructive" size="icon" onClick={() => props.remove()} className="h-8 w-8">
            <lucide_react_1.XCircle className="w-5 h-5"/>
          </button_1.Button>
          <button_1.Button variant="secondary" size="icon" onClick={() => props.insert()} className="h-8 w-8">
            <lucide_react_1.ArrowDownLeftSquare className="w-5 h-5"/>
          </button_1.Button>
        </div>
      </div>
    </>);
}
function ContextPrompts(props) {
    const context = props.context;
    const addContextPrompt = (prompt, i) => {
        props.updateContext((context) => context.splice(i, 0, prompt));
    };
    const createNewEmptyPrompt = () => {
        addContextPrompt({
            role: "user",
            content: "",
        }, props.context.length);
    };
    const removeContextPrompt = (i) => {
        props.updateContext((context) => context.splice(i, 1));
    };
    const updateContextPrompt = (i, prompt) => {
        props.updateContext((context) => (context[i] = prompt));
    };
    return (<>
      <div className="mb-5">
        <div className="font-semibold mb-2 flex items-center justify-between">
          <span>{locales_1.default.Context.Title}</span>
          <button_1.Button variant="secondary" onClick={createNewEmptyPrompt}>
            <lucide_react_1.PlusCircle className="mr-2 h-4 w-4"/> {locales_1.default.Context.Add}
          </button_1.Button>
        </div>
        {context.map((c, i) => (<div key={i} className="p-2">
            <ContextPromptItem index={i} prompt={c} update={(prompt) => updateContextPrompt(i, prompt)} remove={() => removeContextPrompt(i)} insert={() => {
                addContextPrompt({
                    role: "user",
                    content: "",
                }, i + 1);
            }}/>
          </div>))}
      </div>
    </>);
}
exports.ContextPrompts = ContextPrompts;
