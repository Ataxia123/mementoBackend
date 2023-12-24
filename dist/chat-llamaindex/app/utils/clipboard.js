"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyToClipboard = void 0;
const locales_1 = __importDefault(require("../locales"));
async function copyToClipboard(text, displayResult) {
    try {
        await navigator.clipboard.writeText(text);
        displayResult({
            title: locales_1.default.Copy.Success,
            variant: "success",
        });
    }
    catch (error) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            displayResult({
                title: locales_1.default.Copy.Success,
                variant: "success",
            });
        }
        catch (error) {
            displayResult({
                title: locales_1.default.Copy.Failed,
                variant: "destructive",
            });
        }
        document.body.removeChild(textArea);
    }
}
exports.copyToClipboard = copyToClipboard;
