const BASE_URL = "https://api.thenextleg.io/v2";
const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = `https://api.thenextleg.io/v2/`;
const AUTH_HEADERS = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
};
/**
 * A function to pause for a given amount of time
 */
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
/**
 * Continue polling a generation an image is completed, or fails.
 * You can also use a webhook to get notified when the image is ready.
 * It will contain the same response body as seen here.
 */
export const fetchToCompletion = async (messageId, retryCount, maxRetry = 20) => {
    const imageRes = await fetch(`${endpoint}/message/${messageId}`, {
        method: "GET",
        headers: AUTH_HEADERS,
    });
    const imageResponseData = await imageRes.json();
    if (imageResponseData.progress === 100) {
        return imageResponseData;
    }
    if (imageResponseData.progress === "incomplete") {
        throw new Error("Image generation failed");
    }
    if (retryCount > maxRetry) {
        throw new Error("Max retries exceeded");
    }
    if (imageResponseData.progress) {
        console.log("---------------------");
        console.log(`Describe Progress: ${imageResponseData.progress}%`);
        console.log("---------------------");
    }
    await sleep(5000);
    return fetchToCompletion(messageId, retryCount + 1);
};
