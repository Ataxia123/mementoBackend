"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = exports.MarkdownContent = exports.PreCode = exports.Mermaid = void 0;
require("katex/dist/katex.min.css");
const mermaid_1 = __importDefault(require("mermaid"));
const react_1 = require("react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const rehype_highlight_1 = __importDefault(require("rehype-highlight"));
const rehype_katex_1 = __importDefault(require("rehype-katex"));
const remark_breaks_1 = __importDefault(require("remark-breaks"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const remark_math_1 = __importDefault(require("remark-math"));
const locales_1 = __importDefault(require("../../locales"));
const clipboard_1 = require("@/app/utils/clipboard");
const dialog_1 = require("@/app/components/ui/dialog");
const separator_1 = require("@/app/components/ui/separator");
const use_toast_1 = require("@/app/components/ui/use-toast");
const react_2 = __importDefault(require("react"));
const use_debounce_1 = require("use-debounce");
const loading_1 = require("@/app/components/ui/loading");
function Mermaid(props) {
    const ref = (0, react_1.useRef)(null);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const [imageUrl, setImageUrl] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        if (props.code && ref.current) {
            mermaid_1.default
                .run({
                nodes: [ref.current],
                suppressErrors: true,
            })
                .catch((e) => {
                setHasError(true);
                console.error("[Mermaid] ", e.message);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code]);
    function viewSvgInNewWindow() {
        const svg = ref.current?.querySelector("svg");
        if (!svg)
            return;
        const text = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([text], { type: "image/svg+xml" });
        setImageUrl(URL.createObjectURL(blob));
    }
    if (hasError) {
        return null;
    }
    return (<dialog_1.Dialog open={!!imageUrl}>
      <dialog_1.DialogTrigger asChild>
        <div className="no-dark mermaid" style={{
            cursor: "pointer",
            overflow: "auto",
        }} ref={ref} onClick={() => viewSvgInNewWindow()}>
          {props.code}
        </div>
      </dialog_1.DialogTrigger>
      <dialog_1.DialogContent className="max-w-4xl">
        <dialog_1.DialogHeader>
          <dialog_1.DialogTitle>{locales_1.default.Export.Image.Modal}</dialog_1.DialogTitle>
        </dialog_1.DialogHeader>
        <div>
          <img src={imageUrl} alt="preview" className="max-w-full"/>
        </div>
        <separator_1.Separator />
      </dialog_1.DialogContent>
    </dialog_1.Dialog>);
}
exports.Mermaid = Mermaid;
function PreCode(props) {
    const { toast } = (0, use_toast_1.useToast)();
    const ref = (0, react_1.useRef)(null);
    const refText = ref.current?.innerText;
    const [mermaidCode, setMermaidCode] = (0, react_1.useState)("");
    const renderMermaid = (0, use_debounce_1.useDebouncedCallback)(() => {
        if (!ref.current)
            return;
        const mermaidDom = ref.current.querySelector("code.language-mermaid");
        if (mermaidDom) {
            setMermaidCode(mermaidDom.innerText);
        }
    }, 600);
    (0, react_1.useEffect)(() => {
        setTimeout(renderMermaid, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refText]);
    return (<>
      {mermaidCode.length > 0 && (<Mermaid code={mermaidCode} key={mermaidCode}/>)}
      <pre ref={ref} className="group relative">
        <span className="copy-code-button group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto" onClick={() => {
            if (ref.current) {
                const code = ref.current.innerText;
                (0, clipboard_1.copyToClipboard)(code, toast);
            }
        }}></span>
        {props.children}
      </pre>
    </>);
}
exports.PreCode = PreCode;
function _MarkDownContent(props) {
    return (<react_markdown_1.default remarkPlugins={[remark_math_1.default, remark_gfm_1.default, remark_breaks_1.default]} rehypePlugins={[
            rehype_katex_1.default,
            [
                rehype_highlight_1.default,
                {
                    detect: false,
                    ignoreMissing: true,
                },
            ],
        ]} components={{
            pre: PreCode,
            p: (pProps) => <p {...pProps} dir="auto"/>,
            a: (aProps) => {
                const href = aProps.href || "";
                const isInternal = /^\/#/i.test(href);
                const target = isInternal ? "_self" : aProps.target ?? "_blank";
                return <a {...aProps} target={target}/>;
            },
        }}>
      {props.content}
    </react_markdown_1.default>);
}
exports.MarkdownContent = react_2.default.memo(_MarkDownContent);
function Markdown(props) {
    const mdRef = (0, react_1.useRef)(null);
    return (<div className="markdown-body" style={{
            fontSize: `${props.fontSize ?? 14}px`,
        }} ref={mdRef} onContextMenu={props.onContextMenu} onDoubleClickCapture={props.onDoubleClickCapture}>
      {props.loading ? (<loading_1.Loading />) : (<exports.MarkdownContent content={props.content}/>)}
    </div>);
}
exports.Markdown = Markdown;
