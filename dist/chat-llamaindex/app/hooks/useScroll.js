"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollToBottom = void 0;
const react_1 = require("react");
function useScrollToBottom() {
    // for auto-scroll
    const scrollRef = (0, react_1.useRef)(null);
    const [autoScroll, setAutoScroll] = (0, react_1.useState)(true);
    function scrollDomToBottom() {
        const dom = scrollRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true);
                dom.scrollTo(0, dom.scrollHeight);
            });
        }
    }
    // auto scroll
    (0, react_1.useEffect)(() => {
        if (autoScroll) {
            scrollDomToBottom();
        }
    });
    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollDomToBottom,
    };
}
exports.useScrollToBottom = useScrollToBottom;
