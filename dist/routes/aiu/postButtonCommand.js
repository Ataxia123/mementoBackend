// pages/api/postButtonCommand.ts
import axios from "axios";
const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = "https://api.thenextleg.io/v2/button/";
export default async function handler(req, res) {
    const { button, buttonMessageId } = req.body;
    console.log("buttonMessageId ", buttonMessageId);
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`, // Use template literals instead of concatenation
        };
        const response = await axios.post(`${endpoint}`, // Use template literals instead of concatenation
        {
            button,
            buttonMessageId,
            ref: "",
            webhookOverride: `${process.env.BASE_URL}/api/buttonCommandWebhook`, // Use template literals instead of concatenation
        }, { headers });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error(error);
        res.status(error.response.status || 500).json({ message: error.message });
    }
}
