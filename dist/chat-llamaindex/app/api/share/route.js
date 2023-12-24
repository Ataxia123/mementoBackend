"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = exports.POST = void 0;
const kv_1 = require("@vercel/kv");
const server_1 = require("next/server");
const nanoid_1 = require("nanoid");
const DAYS_TO_LIVE = 30;
const TTL = 60 * 60 * 24 * DAYS_TO_LIVE;
const MAX_KEY_GENERATION_RETRY = 100;
async function getKey() {
    let key;
    let counter = 0;
    do {
        key = (0, nanoid_1.nanoid)();
        counter++;
    } while ((await kv_1.kv.exists(key)) && counter < MAX_KEY_GENERATION_RETRY);
    if (counter === MAX_KEY_GENERATION_RETRY) {
        // Handle the case when a unique key was not found within the maximum allowed iterations
        throw new Error("Failed to generate a unique key");
    }
    return key;
}
async function POST(req) {
    try {
        const body = await req.json();
        const key = await getKey();
        body.bot.share = { ...body.bot.share, id: key };
        const data = await kv_1.kv.set(key, body, {
            ex: TTL,
        });
        if (!data) {
            throw new Error(`Can't store bot with key ${key}`);
        }
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const url = `${protocol}://${req.headers.get("host")}/b/${key}`;
        console.log(`[Share] shared bot '${body.bot.name}' created at ${url}`);
        return server_1.NextResponse.json({
            key: key,
            url: url,
            data: data,
            days: DAYS_TO_LIVE,
        });
    }
    catch (error) {
        console.error("[Share] error while sharing bot", error);
        return server_1.NextResponse.json({
            error: true,
            msg: error.message,
        }, {
            status: 500,
        });
    }
}
exports.POST = POST;
exports.runtime = "edge";
