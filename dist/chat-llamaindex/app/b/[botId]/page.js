"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("@/app/components/home");
const react_1 = require("@vercel/analytics/react");
const kv_1 = require("@vercel/kv");
async function App({ params }) {
    console.log(`[Share] try loading bot with key ${params.botId}`);
    let bot = null;
    try {
        const res = await kv_1.kv.get(params.botId);
        bot = res?.bot || null;
    }
    catch (e) {
        console.error(`[Share] failed to load bot with key ${params.botId}`, e);
    }
    if (!bot) {
        console.log(`[Share] requested unknown bot with id ${params.botId}`);
        return (<>
        Sorry, there is no bot at this URL. Try&nbsp;
        <a href="/">creating your own bot</a>.
      </>);
    }
    console.debug("[Share] bot loaded", bot);
    return (<>
      <home_1.Home bot={bot}/>
      <react_1.Analytics />
    </>);
}
exports.default = App;
