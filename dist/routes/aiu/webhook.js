export default async function handler(req, res) {
    const { imageUrl, originatingMessageId, buttonMessageId } = req.body;
    // Store the image URL in the cache
    console.log("webhook received", { imageUrl, originatingMessageId, buttonMessageId });
    res.status(200).json({ message: "Webhook received" });
}
