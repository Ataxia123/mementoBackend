"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMobileScreen = exports.MOBILE_MAX_WIDTH = void 0;
const react_1 = require("react");
function useWindowSize() {
    const [size, setSize] = (0, react_1.useState)({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    (0, react_1.useEffect)(() => {
        const onResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);
    return size;
}
exports.MOBILE_MAX_WIDTH = 640; // based on tailwindcss breakpoint
function useMobileScreen() {
    const { width } = useWindowSize();
    return width <= exports.MOBILE_MAX_WIDTH;
}
exports.useMobileScreen = useMobileScreen;
