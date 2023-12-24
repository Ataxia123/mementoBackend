"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPDFContentFromBuffer = exports.fetchContentFromURL = void 0;
const unified_1 = require("unified");
const rehype_parse_1 = __importDefault(require("rehype-parse"));
const rehype_remark_1 = __importDefault(require("rehype-remark"));
const remark_stringify_1 = __importDefault(require("remark-stringify"));
const axios_1 = __importDefault(require("axios"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const unist_util_remove_1 = require("unist-util-remove");
function removeCommentsAndTables() {
    return (tree) => {
        (0, unist_util_remove_1.remove)(tree, { type: "comment" });
        (0, unist_util_remove_1.remove)(tree, { tagName: "table" });
    };
}
async function htmlToMarkdown(html) {
    const processor = (0, unified_1.unified)()
        .use(rehype_parse_1.default) // Parse the HTML
        .use(removeCommentsAndTables) // Remove comment nodes
        .use(rehype_remark_1.default) // Convert it to Markdown
        .use(remark_stringify_1.default); // Stringify the Markdown
    const file = await processor.process(html);
    return String(file);
}
async function fetchContentFromURL(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failure fetching content from provided URL");
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
        const htmlContent = await response.text();
        const markdownContent = await htmlToMarkdown(htmlContent);
        return {
            url,
            content: markdownContent,
            size: htmlContent.length,
            type: "text/html",
        };
    }
    if (contentType.includes("application/pdf")) {
        const response = await axios_1.default.get(url, {
            responseType: "arraybuffer",
        });
        const pdfBuffer = response.data;
        const pdfData = await (0, pdf_parse_1.default)(pdfBuffer);
        const result = {
            url,
            content: pdfData.text,
            size: pdfData.text.length,
            type: "application/pdf",
        };
        return result;
    }
    throw new Error("URL provided is not a PDF or HTML document");
}
exports.fetchContentFromURL = fetchContentFromURL;
const getPDFContentFromBuffer = async (pdfBuffer) => {
    const data = await (0, pdf_parse_1.default)(pdfBuffer);
    const content = data.text;
    const size = data.text.length;
    return {
        content,
        size,
        type: "application/pdf",
    };
};
exports.getPDFContentFromBuffer = getPDFContentFromBuffer;
