"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyObject = void 0;
function prettyObject(msg) {
    const obj = msg;
    if (typeof msg !== "string") {
        msg = JSON.stringify(msg, null, "  ");
    }
    if (msg === "{}") {
        return obj.toString();
    }
    if (msg.startsWith("```json")) {
        return msg;
    }
    return ["```json", msg, "```"].join("\n");
}
exports.prettyObject = prettyObject;
