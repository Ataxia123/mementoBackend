// Webhook response received from The Next Leg
// {
//   "createdAt": {
//       "_nanoseconds": 215000000,
//       "_seconds": 1678840347
//   },
//   "buttons": [
//       "U1",
//       "U2",
//       "U3",
//       "U4",
//       "🔄",
//       "V1",
//       "V2",
//       "V3",
//       "V4"
//   ],
//   "imageUrl": "your-image-url",
//   "buttonMessageId": "OtfxNzfMIKBPVE1aP4u4",
//   "originatingMessageId": "your-message-id",
//   "content": "your-original-prompt"
// }
// pages/api/webhook.ts
// webhook.ts
import { Request, Response } from "express"

export default async function handler(req: Request, res: Response) {
    const { imageUrl, originatingMessageId, buttonMessageId } = req.body;

    // Store the image URL in the cache

    console.log("webhook received", { imageUrl, originatingMessageId, buttonMessageId });
    res.status(200).json({ message: "Webhook received" });
}
