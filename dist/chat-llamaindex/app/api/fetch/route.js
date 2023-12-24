"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = exports.runtime = exports.POST = exports.GET = void 0;
const content_1 = require("@/app/api/fetch/content");
const server_1 = require("next/server");
const embeddings_1 = __importDefault(require("./embeddings"));
async function GET(request) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const site = searchParams.get("site");
    if (!site) {
        return server_1.NextResponse.json({ error: "Missing site parameter" }, { status: 400 });
    }
    try {
        const urlContent = await (0, content_1.fetchContentFromURL)(site);
        urlContent.embeddings = await (0, embeddings_1.default)(urlContent.content);
        return server_1.NextResponse.json(urlContent);
    }
    catch (error) {
        console.error("[Fetch]", error);
        return server_1.NextResponse.json({ error: error.message }, { status: 400 });
    }
}
exports.GET = GET;
async function handleText(fileName, text) {
    const embeddings = await (0, embeddings_1.default)(text);
    return {
        content: text,
        embeddings: embeddings,
        url: fileName,
        size: text.length,
        type: "text/plain",
    };
}
async function handlePDF(fileName, pdf) {
    const pdfBuffer = Buffer.from(pdf, "base64");
    const pdfData = await (0, content_1.getPDFContentFromBuffer)(pdfBuffer);
    const embeddings = await (0, embeddings_1.default)(pdfData.content);
    return {
        content: pdfData.content,
        embeddings: embeddings,
        size: pdfData.size,
        type: "application/pdf",
        url: fileName,
    };
}
async function POST(request) {
    try {
        const { fileName, pdf, text } = await request.json();
        if (!fileName && (!pdf || !text)) {
            return server_1.NextResponse.json({
                error: "filename and either text or pdf is required in the request body",
            }, { status: 400 });
        }
        const json = await (pdf
            ? handlePDF(fileName, pdf)
            : handleText(fileName, text));
        return server_1.NextResponse.json(json);
    }
    catch (error) {
        console.error("[Fetch]", error);
        return server_1.NextResponse.json({
            error: error.message,
        }, {
            status: 500,
        });
    }
}
exports.POST = POST;
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
