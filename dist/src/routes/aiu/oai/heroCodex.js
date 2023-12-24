import OpenAI from "openai";
export async function generateCodexOutput(capName) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const messages = [
        {
            role: "system",
            content: `You are N.A.V.I, an AI registrar for the Alliance of the
            Infinite Universe.Fill out the structure provided in JSON format. Use your creativity to 
            complete the form with interesting data.
{
    heroCodex: {
            capName: ${capName};
            shipId: string;
            questBrief: string;
            stats: Stats;
            abilities: string[];
            inventory: Item[];
            powerLevel: number;
            funFact: string;
            location: Location;
};
`,
        },
        {
            role: "assistant",
            content: `


 type Location = {
    locationId: string;
    coordinates: [
        x: number,
        y: number,
        z: number,
    ];
    locationName: string;
    locationFunFact: string;
    nearestLocationId: string;
    navigationNotes: string;
    imageUrl: string;
}

type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
}
type Stats = {
    maxHealth: number;
    speed: number;
    attack: number;
    defense: number;
    maxRange: number
    abilities: Ability[]
    status: { health: number; resources: number; status: string[]; };
};




`,
        },
        {
            role: "user",
            content: `
SUBMITTING PILOT DATA TO ALLIANCE DATABASE.
REQUESTING ATTESTATION FROM AIU-CENTRAL.
Triangulate the data for the hero codex entry of the following captain: ${capName} 

          


`,
        },
    ];
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 1.5,
    });
    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
