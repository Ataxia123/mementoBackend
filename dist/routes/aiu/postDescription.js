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
const fetchToCompletion = async (messageId, retryCount, maxRetry = 20) => {
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
export default async function handler(req, res) {
    const { url } = await req.body;
    console.log(url);
    console.log("|======DEBUGGING=======|", url, JSON.stringify(req.body));
    const config = {
        method: "post",
        url: "https://api.thenextleg.io/v2/describe",
        headers: {
            Authorization: "Bearer " + AUTH_TOKEN,
            "Content-Type": "application/json",
        },
        data: { url: url },
    };
    try {
        axios(config)
            .then(async function (response) {
            console.log("\n=====================");
            console.log("IMAGE GENERATION MESSAGE DATA");
            console.log(response);
            console.log("=====================");
            console.log("response", response.data);
            console.log("messageID", response.data.messageId);
            // Start waiting for webhook
            console.log("Waiting for webhook to be received...");
            const completedImageData = await fetchToCompletion(response.data.messageId, 0);
            console.log("\n=====================");
            console.log("COMPLETED IMAGE DATA");
            console.log(completedImageData);
            console.log("=====================");
            res.status(200).json(completedImageData);
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.error(error);
        res.status(error.response.status || 500).json({ message: error.message });
    }
}
