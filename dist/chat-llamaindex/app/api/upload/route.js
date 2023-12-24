"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const blob_1 = require("@vercel/blob");
const server_1 = require("next/server");
async function POST(request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    if (!filename || !request.body) {
        return server_1.NextResponse.json({ error: "Missing filename URL parameter or request body" }, { status: 400 });
    }
    try {
        const blob = await (0, blob_1.put)(filename, request.body, {
            access: "public",
        });
        const json = {
            type: blob.contentType,
            url: blob.url,
            // TODO: needs to return the size of the uploaded file
            size: NaN,
        };
        return server_1.NextResponse.json(json);
    }
    catch (error) {
        console.error("[Upload]", error);
        return server_1.NextResponse.json({
            error: error.message,
        }, {
            status: 500,
        });
    }
}
exports.POST = POST;
