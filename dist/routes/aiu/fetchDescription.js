export default async function handler(req, res) {
    const messageId = req.query.messageId;
    console.log("messageId", messageId);
    res.status(404).json({ message: "Description not found" });
}
