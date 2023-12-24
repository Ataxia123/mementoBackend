"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSiteContent = exports.isURL = void 0;
const isURL = (text) => {
    const isUrlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return isUrlRegex.test(text);
};
exports.isURL = isURL;
async function fetchSiteContent(site) {
    const response = await fetch(`/api/fetch?site=${site}`);
    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error);
    return data;
}
exports.fetchSiteContent = fetchSiteContent;
